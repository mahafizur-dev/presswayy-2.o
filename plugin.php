<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Presswayy_Webhook_Sync {

   
    private $option_name = 'wc_n8n_webhook_url';
    private $default_webhook = 'https://server.presswayy.com/webhook/get-data';

    public function __construct() {
        
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        add_action( 'admin_init', array( $this, 'register_settings' ) );

        
        add_action( 'woocommerce_after_product_object_save', array( $this, 'trigger_webhook' ), 10, 2 );

       
        add_action( 'admin_init', array( $this, 'initial_sync_on_install' ) );
    }

   
    public function add_admin_menu() {
        add_options_page(
            __( 'Presswayy Settings', 'presswayy-sync' ),
            __( 'Presswayy', 'presswayy-sync' ), 
            'manage_options',
            'presswayy-settings',
            array( $this, 'settings_page_html' )
        );
    }

   
    public function register_settings() {
        register_setting( 'presswayy_webhook_group', $this->option_name, 'esc_url_raw' );
    }

    
    public function settings_page_html() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Presswayy Webhook Settings', 'presswayy-sync' ); ?></h1>
            <p><?php esc_html_e( 'This plugin allows you to sync your WooCommerce products with Presswayy.', 'presswayy-sync' ); ?></p>
            
            <form action="options.php" method="post">
                <?php
                settings_fields( 'presswayy_webhook_group' );
                do_settings_sections( 'presswayy_webhook_group' );
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row"><?php esc_html_e( 'Webhook URL', 'presswayy-sync' ); ?></th>
                        <td>
                            <input type="url" name="<?php echo esc_attr( $this->option_name ); ?>" value="<?php echo esc_attr( get_option( $this->option_name, $this->default_webhook ) ); ?>" class="regular-text" placeholder="https://your-n8n-domain.com/webhook/..." required />
                        </td>
                    </tr>
                </table>
                <?php submit_button( __( 'Settings Save Korun', 'presswayy-sync' ) ); ?>
            </form>
            
            <hr>
            <h3><?php esc_html_e( 'Manual Sync', 'presswayy-sync' ); ?></h3>
            <p><?php esc_html_e( 'যদি আপনি আবার সব প্রোডাক্ট একসাথে সিঙ্ক করতে চান, তাহলে নিচের বাটনটিতে ক্লিক করুন।', 'presswayy-sync' ); ?></p>
            <form method="post" action="">
                <?php wp_nonce_field( 'wc_n8n_manual_sync_action', 'wc_n8n_manual_sync_nonce' ); ?>
                <input type="submit" name="wc_n8n_run_manual_sync" class="button button-secondary" value="<?php esc_attr_e( 'Sync All Products Now', 'presswayy-sync' ); ?>">
            </form>
            <?php
        
            if ( isset( $_POST['wc_n8n_run_manual_sync'] ) && check_admin_referer( 'wc_n8n_manual_sync_action', 'wc_n8n_manual_sync_nonce' ) ) {
                $this->process_bulk_sync();
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'সব প্রোডাক্ট সফলভাবে পাঠানো হয়েছে!', 'presswayy-sync' ) . '</p></div>';
            }
            ?>
        </div>
        <?php
    }

 
    public function trigger_webhook( $product, $data_store ) {
        $webhook_url = get_option( $this->option_name, $this->default_webhook );

        if ( empty( $webhook_url ) ) {
            return;
        }

        $image_id  = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_url( $image_id ) : '';

        $payload = array(
            'event'       => 'product_updated',
            'product_id'  => $product->get_id(),
            'name'        => $product->get_name(),
            'price'       => $product->get_price(),
            'description' => wp_strip_all_tags( $product->get_description() ),
            'stock'       => $product->get_stock_quantity(),
            'sku'         => $product->get_sku(),
            'image_url'   => $image_url,
            'status'      => $product->get_status(),
            'timestamp'   => current_time( 'mysql' )
        );

        $args = array(
            'body'        => wp_json_encode( $payload ),
            'timeout'     => 5,
            'blocking'    => false,
            'headers'     => array( 'Content-Type' => 'application/json' ),
        );

        wp_remote_post( $webhook_url, $args );
    }

    
    public function initial_sync_on_install() {
        if ( ! get_option( 'wc_n8n_initial_sync_done' ) ) {
            
            $webhook_url = get_option( $this->option_name, $this->default_webhook );
            
            if ( ! get_option( $this->option_name ) ) {
                update_option( $this->option_name, $webhook_url );
            }

            $this->process_bulk_sync( 'plugin_activated' );

            update_option( 'wc_n8n_initial_sync_done', true );
        }
    }

    private function process_bulk_sync( $event_name = 'manual_bulk_sync' ) {
        $webhook_url = get_option( $this->option_name, $this->default_webhook );
        
        $initial_products = array();
        $all_products = wc_get_products( array( 'limit' => -1, 'status' => 'publish' ) );
        
        foreach ( $all_products as $product ) {
            $image_id  = $product->get_image_id();
            $initial_products[] = array(
                'product_id'  => $product->get_id(),
                'name'        => $product->get_name(),
                'price'       => $product->get_price(),
                'description' => wp_strip_all_tags( $product->get_description() ),
                'stock'       => $product->get_stock_quantity(),
                'sku'         => $product->get_sku(),
                'image_url'   => $image_id ? wp_get_attachment_url( $image_id ) : '',
                'status'      => $product->get_status(),
            );
        }

        $payload = array(
            'event'       => $event_name,
            'message'     => 'Bulk product sync completed!',
            'site_url'    => get_site_url(),
            'products'    => $initial_products,
            'timestamp'   => current_time( 'mysql' )
        );

        $args = array(
            'body'        => wp_json_encode( $payload ),
            'timeout'     => 15,
            'blocking'    => false,
            'headers'     => array( 'Content-Type' => 'application/json' ),
        );

        wp_remote_post( $webhook_url, $args );
    }
}

add_action( 'plugins_loaded', 'init_presswayy_webhook_sync' );

function init_presswayy_webhook_sync() {
    if ( class_exists( 'WooCommerce' ) ) {
        new Presswayy_Webhook_Sync();
    }
}