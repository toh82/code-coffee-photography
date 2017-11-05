<?php

require_once('shopMail.php');

/**
 * @var ShopMail $mail
 */
$mail = new ShopMail('html', 'mail.html');
$mail->setFrom('hartmann.tobias@gmail.com');
$mail->setTo('hartmann.tobias@gmail.com');
$mail->setSubject('TODO ccp Shop Bestellung - Dingens');
$mail->setBody([
    'title'                   => 'Bestellung auf Code Coffee and Photography',
    'productDescription'      => 'Ein tolles produkt',
    'stripeChargeId'          => '0815',
    'stripeChargeAmount'      => '5000',
    'stripeChargeCreatedDate' => '123456',
    'footer'                  => 'Code Coffee and Photography<br>Tobias Hartmann . Castellring 103 . 61130 Nidderau',
    'from'                    => 'hartmann.tobias@gmail.com'
]);
echo $mail->toHtml();