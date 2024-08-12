import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './forms.css';

const ProductManagement = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // Add state for "Add" mode

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        const response = await api.get('/api/products/get-all-products', headers);
        if (response.data.success) {
          setProducts(response.data.data.products || []);
        } else {
          toast.error(`Erro: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast.error('Erro ao buscar produtos');
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSearch = async () => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await api.get(`/api/products/get-one-product/${searchId}`, headers);
      
      if (response.data.success) {
        setSelectedProduct(response.data.data.product);
        setShowAllProducts(false);
        toast.success('Produto encontrado!');
      } else {
        setSelectedProduct(null);
        setShowAllProducts(true);
        toast.error(`Erro: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast.error('Erro ao buscar produto');
      setSelectedProduct(null);
      setShowAllProducts(true);
    }
  };

  const handleProductUpdate = async (data) => {
    const { id, ...productData } = data;
    productData.price = Number(productData.price);
    productData.stock = Number(productData.stock);

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      await api.patch(`/api/products/update-product/${selectedProduct.id}`, productData, headers);
      reset();
      setSelectedProduct(null);
      setShowAllProducts(true);
      setIsEditMode(false);
      toast.success('Produto atualizado com sucesso!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
    }
  };

  const handleProductAdd = async (data) => {
    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    };

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      await api.post('/api/products/create-product', productData, headers);
      reset();
      setIsAddMode(false);
      setShowAllProducts(true);
      toast.success('Produto adicionado com sucesso!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const handleProductDelete = async (id) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      await api.delete(`/api/products/delete-product/${id}`, headers);
      
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowAllProducts(false);
    setIsEditMode(true);
    setIsAddMode(false);
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("description", product.description);
    setValue("stock", product.stock);
  };

  const handleAddProductClick = () => {
    setSelectedProduct(null);
    setShowAllProducts(false);
    setIsEditMode(false);
    setIsAddMode(true);
    reset();
  };

  const handleBackToAllProducts = () => {
    setSelectedProduct(null);
    setShowAllProducts(true);
    setIsEditMode(false);
    setIsAddMode(false);
    reset();
    setSearchId(""); // Limpa o campo de busca
  };

  return (
    <DefaultLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar closeOnClick />
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Gestão de Produtos</h2>
        
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Buscar Produto por ID</h3>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Digite o ID do produto"
              className="p-3 rounded-lg border border-gray-300 w-full"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              onClick={handleProductSearch}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Buscar
            </button>
          </div>
        </div>

        <button
          onClick={handleAddProductClick}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition mb-6"
        >
          Adicionar Produto
        </button>

        {showAllProducts ? (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Todos os Produtos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                    <p className="text-gray-600 mb-1">ID: {product.id}</p>
                    <p className="text-gray-700 mb-1">Preço: $ {product.price.toFixed(2)}</p>
                    <p className="text-gray-600 mb-1">Descrição: {product.description}</p>
                    <p className="text-gray-600 mb-4">Estoque: {product.stock}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Editar Produto
                      </button>
                      <button
                        onClick={() => handleProductDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Excluir Produto
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Nenhum produto encontrado.</p>
              )}
            </div>
          </div>
        ) : (
          selectedProduct && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-2">{selectedProduct.name}</h4>
              <p className="text-gray-600 mb-1">ID: {selectedProduct.id}</p>
              <p className="text-gray-700 mb-1">Preço: $ {selectedProduct.price.toFixed(2)}</p>
              <p className="text-gray-600 mb-1">Descrição: {selectedProduct.description}</p>
              <p className="text-gray-600 mb-4">Estoque: {selectedProduct.stock}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEditClick(selectedProduct)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Editar Produto
                </button>
                <button
                  onClick={() => handleProductDelete(selectedProduct.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Excluir Produto
                </button>
                <button
                  onClick={handleBackToAllProducts}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Voltar
                </button>
              </div>
            </div>
          )
        )}

        {(isEditMode || isAddMode) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-6">{isAddMode ? 'Adicionar Novo Produto' : 'Atualizar Produto'}</h3>
              <form onSubmit={handleSubmit(isAddMode ? handleProductAdd : handleProductUpdate)}>
                {isEditMode && <input type="hidden" {...register("id")} value={selectedProduct?.id} />}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    {...register("name", { required: "Nome é obrigatório" })}
                    className="p-3 rounded-lg border border-gray-300 w-full"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Preço</label>
                  <input
                    type="number"
                    {...register("price", { required: "Preço é obrigatório" })}
                    className="p-3 rounded-lg border border-gray-300 w-full"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <input
                    type="text"
                    {...register("description", { required: "Descrição é obrigatória" })}
                    className="p-3 rounded-lg border border-gray-300 w-full"
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Estoque</label>
                  <input
                    type="number"
                    {...register("stock", { required: "Estoque é obrigatório" })}
                    className="p-3 rounded-lg border border-gray-300 w-full"
                  />
                  {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                  >
                    {isAddMode ? 'Adicionar' : 'Atualizar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToAllProducts}
                    className="bg-red-500 text-white px-6 py-3 ml-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ProductManagement;
