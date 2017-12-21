<?php

// TODO consider using silex and composer
require_once('../../shop/config.php');
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

/**
 * @param string        $subject
 * @param string        $from
 * @param string        $to
 * @param string        $address
 * @param stripe\Charge $charge
 * @param array         $product
 * @param string        $template
 */
function sendMail($subject, $from, $to, $address, array $charge, stripe\Charge $product, $template)
{
    /** @var ShopMail $mail */
    $mail = new ShopMail('html', $template);
    $mail->setFrom($from);
    $mail->setTo($to);
    $mail->setSubject($subject);
    $mail->setBody([
        'title'                   => $subject,
        'productID'               => $product['id'],
        'stripeChargeEmail'       => $charge['email'],
        'stripeChargeId'          => $charge['id'],
        'stripeChargeAmount'      => $charge['amount'],
        'stripeChargeCreatedDate' => $charge['created'],
        'footer'                  => $address,
        'from'                    => $from,
    ]);
    $mail->send();
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
        'statement_descriptor' => substr($product['id'], 0, 21), // statement_descriptor only takes 22 chars
        'currency'             => 'eur',
    ]);

    if ($charge['status'] === 'succeeded') {
        $subject = 'Bestellung auf Code, Coffee & Photography - ' . $product['id'];
        $from    = 'order@code-coffee-photography.blog';
        $address = 'Code Coffee and Photography<br>Tobias Hartmann . Castellring 103 . 61130 Nidderau';

        // Admin Mail
        sendMail(
            'TODO - ' . $subject,
            $from,
            'hartmann.tobias@gmail.com',
            $address,
            $charge,
            $product,
            'mail.html'
        );

        // Customer Mail
        sendMail(
            $subject,
            $from,
            $charge['email'],
            $address,
            $charge,
            $product,
            'customerMail.html'
        );

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
