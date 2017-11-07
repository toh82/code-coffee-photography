<?php

// TODO consider using silex and composer
require_once('config.php');
require_once('products.php');
require_once('shopMail.php');

/**
 * @param array $return
 */
function returnJsonAndExit(array $return)
{
    header("Content-type: application/json; charset=utf-8");
    echo json_encode($return);

    exit;
}

/** @var array $return */
$return = [];

/** @var array $item */
$item = $_POST['item'];
// TODO for validation check Wixel/GUMP on github
if (!is_array($item)) {
    throw new Exception('no valid product was send, expected array.');
}
if (!key_exists('id', $item)) {
    throw new Exception('product has no id.');
}
if (!preg_match("/^([a-z]*)_([a-z-]*)/", $item['id'])) {
    throw new Exception('product id is not valid.');
}

/** @var Products $products */
$products = new Products();
$products->setSource('../../shop/products.json');
$products->sync();

if (!$products->isExistingProduct($item['id'])) {
    returnJsonAndExit([
        'status'  => 'error',
        'message' => 'Bezahlung wurde nicht ausgeführt, entweder exisitert das Produkt nicht oder der Preis ist nicht korrekt.',
    ]);
}

/** @var array $product */
$product = $products->getProduct($item['id']);

try {
    $charge = \Stripe\Charge::create([
        'source'               => $_POST['token'], // this has to be the token id only
        'amount'               => $product['price'],
        'statement_descriptor' => $product['id'], // statement_descriptor only takes 22 chars
        'currency'             => 'eur',
    ]);

    if ($charge['status'] === 'succeeded') {
        /** @var ShopMail $mail */
        $mail = new ShopMail('html', 'mail.html');
        $mail->setFrom('hartmann.tobias@gmail.com');
        $mail->setTo('hartmann.tobias@gmail.com');
        $mail->setSubject('TODO code coffee photography Shop Bestellung - ' . $product['id']);
        $mail->setBody([
            'title'                   => 'Bestellung auf Code Coffee and Photography',
            'productID'               => $product['id'],
            'stripeTokenEmail'        => $token['email'],
            'stripeChargeId'          => $charge['id'],
            'stripeChargeAmount'      => $charge['amount'],
            'stripeChargeCreatedDate' => $charge['created'],
            'footer'                  => 'Code Coffee and Photography<br>Tobias Hartmann . Castellring 103 . 61130 Nidderau',
            'from'                    => 'hartmann.tobias@gmail.com',
        ]);
        $mail->send();

        returnJsonAndExit([
            'status'  => 'success',
            'message' => 'Danke das du was gekauft hast! Ich werde mich innerhalb von 48 Stunden darum kümmern.',
        ]);
    }
} catch (Exception $error) {
    returnJsonAndExit([
        'status'  => 'error',
        'message' => 'Bezahlung wurde nicht ausgeführt: ' . $error->getMessage(),
    ]);
}
