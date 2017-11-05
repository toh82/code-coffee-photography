<?php

/**
 * Class Mail
 */
class ShopMail
{
    const TYPE_HTML  = 'html';
    const TYPE_PLAIN = 'plain';

    /**
     * @var array
     */
    private $body;

    /**
     * @var string
     */
    private $subject;

    /**
     * @var string
     */
    private $to;

    /**
     * @var string
     */
    private $from;

    /**
     * @var string
     */
    private $template;

    /**
     * @var string
     */
    private $type;

    /**
     * Mail constructor.
     *
     * @param string $type
     * @param string $templateSrc
     */
    public function __construct($type = 'html', $templateSrc = 'mail.html')
    {
        $this->setType($type);
        $this->setTemplate($templateSrc);
    }

    /**
     * @param string $src
     */
    private function setTemplate($src)
    {
        $this->template = file_get_contents($src);
    }

    /**
     * @param string $type
     */
    private function setType($type)
    {
        $this->type = $type;
    }

    /**
     * Returns html header
     */
    private function getHtmlHeader()
    {
        $header = 'MIME-Version: 1.0' . "\r\n";
        $header .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $header .= 'From: ' . $this->from . ' <' . $this->from . '>' . "\r\n";

        return $header;
    }

    /**
     * @param array $body
     */
    public function setBody(array $body)
    {
        $this->body = $body;
    }

    /**
     * @param string $from
     */
    public function setFrom($from)
    {
        $this->from = $from;
    }

    /**
     * @param string $subject
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    /**
     * @param string $to
     */
    public function setTo($to)
    {
        $this->to = $to;
    }

    /**
     * @return mixed|string
     */
    private function renderBody()
    {
        $result   = $this->template;
        $bodyData = $this->body;

        foreach ($bodyData as $dataKey => $dataValue) {
            $result = preg_replace('/###' . $dataKey . '###/', $dataValue, $result);
        }

        return $result;
    }

    /**
     * @return bool
     */
    public function send()
    {
        return mail(
            $this->to,
            $this->subject,
            $this->renderBody(),
            $this->getHtmlHeader()
        );
    }

    /**
     * @return mixed|string
     */
    public function toHtml()
    {
        return $this->renderBody();
    }
}

