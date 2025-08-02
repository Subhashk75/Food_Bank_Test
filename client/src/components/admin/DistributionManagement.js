import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { productService ,transactionService } from '../utils/api';

const Distribution = () => {
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [purpose, setPurpose] = useState('');
  const [batchSize, setBatchSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAll();
        setProductOptions(res.data);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProductId || !quantity) {
      toast({
        title: 'Missing fields',
        description: 'Please select a product and enter quantity.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const selectedProduct = productOptions.find(
      (p) => p._id === selectedProductId
    );

    setProducts((prev) => [
      ...prev,
      {
        _id: selectedProduct._id,
        name: selectedProduct.name,
        quantity,
      },
    ]);
    setSelectedProductId('');
    setQuantity('');
  };

  const handleDistribute = async () => {
    if (!unit || !purpose || !batchSize || products.length === 0) {
      toast({
        title: 'Missing input',
        description: 'Please complete all fields and add at least one product.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    console.log(products)
    try {
      for (let product of products) {
        const payload = {
          product: product._id,
          quantity: Number(product.quantity),
          unit,
          purpose,
          batchSize,
          operation: 'Distribute',
        };
         
        console.log(payload)
        await transactionService.create(payload);
      }

      toast({
        title: 'Distributed',
        description: 'Products distributed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setProducts([]);
      setUnit('');
      setPurpose('');
      setBatchSize('');
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Distribution failed.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Product</FormLabel>
          <Select
            placeholder="Select product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            {productOptions.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Quantity</FormLabel>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </FormControl>

        <Button onClick={handleAddProduct}>Add Product</Button>

        {products.length > 0 && (
          <Box borderWidth="1px" p={3} borderRadius="md">
            <Text fontWeight="bold" mb={2}>Products to Distribute:</Text>
            {products.map((p, idx) => (
              <Text key={idx}>
                {p.name} - {p.quantity}
              </Text>
            ))}
          </Box>
        )}

        <FormControl>
          <FormLabel>Unit</FormLabel>
          <Select
            placeholder="Select unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="pcs">pcs</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="ml">ml</option>
            <option value="box">box</option>
            <option value="pack">pack</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Purpose</FormLabel>
          <Input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Batch Size</FormLabel>
          <Input
            type="text"
            value={batchSize}
            onChange={(e) => setBatchSize(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleDistribute}
          isLoading={isLoading}
        >
          Distribute
        </Button>
      </VStack>
    </Box>
  );
};

export default Distribution;
