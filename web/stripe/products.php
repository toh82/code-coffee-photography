<?php

/**
 * Class Products
 *
 * @author Tobias Hartmann <hartmann.tobias@gmail.com>
 */
class Products
{
    /**
     * Contains the product items after sync
     *
     * @var array
     */
    private $products;

    /**
     * Path or url where to find the products
     *
     * @var string
     */
    private $source;

    /**
     * @param string $id
     *
     * @return bool|int|string
     */
    private function getProductIndex($id)
    {
        foreach ($this->products as $key => $product) {
            if ($product['id'] === $id) {
                return $key;
            }
        }

        return false;
    }

    /**
     * @param string $id
     *
     * @return bool
     */
    public function isExistingProduct($id)
    {
        return $this->getProductIndex($id) !== false;
    }

    /**
     * @param $id
     *
     * @return string
     */
    public function getProductPrice($id)
    {
        $productIndex = $this->getProductIndex($id);
        $product      = $this->products[$productIndex];

        return $product['price'];
    }

    /**
     * @param array $products
     */
    public function setProducts($products)
    {
        $this->products = $products;
    }

    /**
     * @param string $id
     *
     * @return array
     */
    public function getProduct($id)
    {
        $productIndex = $this->getProductIndex($id);

        return $this->products[$productIndex];
    }

    /**
     * @param string $id
     *
     * @return string
     */
    public function getProductDescription($id)
    {
        $productIndex = $this->getProductIndex($id);
        $product      = $this->products[$productIndex];

        return $product['description'];
    }

    /**
     * @param string $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }

    /**
     * @return string
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * Syncs the model items with source
     */
    public function sync()
    {
        $productsFileContent = file_get_contents($this->getSource());
        $this->setProducts(json_decode($productsFileContent, true));
    }
}