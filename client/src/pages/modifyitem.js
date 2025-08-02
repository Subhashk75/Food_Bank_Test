import React, { useState, useEffect } from 'react';
import {
  InputGroup,
  Input,
  InputLeftAddon,
  Button,
  Flex,
  Box,
  List,
  ListItem,
  useColorModeValue,
  useToast,
  FormControl,
  Select,
  FormLabel,
  Text
} from '@chakra-ui/react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { productService, inventoryService } from '../components/utils/api';
import Auth from '../components/utils/auth';
import { useNavigate } from 'react-router-dom';

function ModifyItem() {
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.700", "gray.200");
  const toast = useToast();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState('');
  const [inputValues, setInputValues] = useState({
    id: '',
    name: '',
    quantity: ''
  });

  const [transactionInfo, setTransactionInfo] = useState({
    unit: '',
    purpose: '',
    batchSize: ''
  });

  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!Auth.loggedIn()) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        setProducts(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch products',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, toast]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);
    const filtered = products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (product) => {
    setInputValues({
      id: product._id,
      name: product.name,
      quantity: ''
    });
    setSearchName(product.name);
    setSuggestions([]);
  };

  const handleModifyItem = async () => {
    const { id, name, quantity } = inputValues;
    const { unit, purpose, batchSize } = transactionInfo;

    if (!id || !name || !quantity || !unit || !purpose) {
      toast({
        title: 'Error',
        description: 'All required fields must be filled',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setUpdating(true);
      const payload = {
        productId: id,
        quantity: parseInt(quantity),
        unit,
        purpose,
        batchSize
      };

      await inventoryService.create(payload);

      toast({
        title: 'Success',
        description: `Inventory updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setInputValues({ id: '', name: '', quantity: '' });
      setTransactionInfo({ unit: '', purpose: '', batchSize: '' });
      setSearchName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Inventory update failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <Flex as="main" flex="1" p={4}>
        <Sidebar />
        <Box flex="1" ml={{ base: 0, md: 4 }} p={5} bg={bg} borderRadius="md" color={color}>
          <InputGroup mb={3}>
            <InputLeftAddon width="150px">Search Product</InputLeftAddon>
            <Input
              placeholder="Product name"
              value={searchName}
              onChange={handleSearchChange}
            />
          </InputGroup>

          {suggestions.length > 0 && (
            <Box borderWidth="1px" borderRadius="md" p={2} maxH="200px" overflowY="auto">
              <List>
                {suggestions.map((product) => (
                  <ListItem
                    key={product._id}
                    p={2}
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    {product.name}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {inputValues.id && (
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>Selected Product: {inputValues.name}</Text>

              <InputGroup mt={2}>
                <InputLeftAddon width="150px">Quantity</InputLeftAddon>
                <Input
                  type="number"
                  min="1"
                  value={inputValues.quantity}
                  onChange={(e) =>
                    setInputValues({ ...inputValues, quantity: e.target.value })
                  }
                />
              </InputGroup>

              <FormControl mt={2}>
                <FormLabel>Unit</FormLabel>
                <Select
                  placeholder="Select unit"
                  value={transactionInfo.unit}
                  onChange={(e) => setTransactionInfo({ ...transactionInfo, unit: e.target.value })}
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

              <InputGroup mt={2}>
                <InputLeftAddon width="150px">Purpose</InputLeftAddon>
                <Input
                  placeholder="e.g. Donated by NGO"
                  value={transactionInfo.purpose}
                  onChange={(e) =>
                    setTransactionInfo({ ...transactionInfo, purpose: e.target.value })
                  }
                />
              </InputGroup>

              <InputGroup mt={2}>
                <InputLeftAddon width="150px">Batch Size</InputLeftAddon>
                <Input
                  placeholder="Optional"
                  value={transactionInfo.batchSize}
                  onChange={(e) =>
                    setTransactionInfo({ ...transactionInfo, batchSize: e.target.value })
                  }
                />
              </InputGroup>

              <Button
                mt={4}
                colorScheme="teal"
                isLoading={updating}
                onClick={handleModifyItem}
              >
                Record Receipt
              </Button>
            </Box>
          )}
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}

export default ModifyItem;
