// commit
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { Product, FirestoreProduct } from '../types';
import Navigation from './Navigation';
import { productService } from '../services/productService';
import { useState } from 'react';

export default function ProductList() {
  const dispatch = useDispatch();
  const { category } = useParams();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<FirestoreProduct>>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    stock: 0,
    rating: { rate: 0, count: 0 }
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts
  });

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNewProduct({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
        stock: 0,
        rating: { rate: 0, count: 0 }
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<FirestoreProduct> }) =>
      productService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imageUrl = await productService.uploadImage(e.target.files[0]);
        console.log('Uploaded image URL:', imageUrl); // Add this to debug
        setNewProduct(prev => ({ ...prev, image: imageUrl }));
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newProduct as Omit<FirestoreProduct, 'createdAt' | 'updatedAt'>);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        updates: editingProduct
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  console.log("All products:", products);
  console.log("Current category:", category);

  const filteredProducts = category && category !== 'all'
    ? products?.filter(product => product.category === category)
    : products;
  
  console.log("Filtered products:", filteredProducts);

  // Add an alert if no products found for a category
  if (category && filteredProducts?.length === 0) {
    console.warn(`No products found for category: ${category}`);
  }

  return (
    <>
      <Navigation />

      {/* Create Product Form */}
      <form onSubmit={handleCreateProduct} className="mb-4">
        <h3>Add New Product</h3>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={newProduct.title}
              onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />
            Price
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            />
            Quantity
          </div>
          <div className="col">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">Add Product</button>
          </div>
        </div>
      </form>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredProducts?.map((product: Product) => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <img 
                src={product.image || 'https://placehold.co/200x200/lightgray/white?text=No+Image'} 
                className="card-img-top p-3" 
                alt={product.title}
                style={{ height: '200px', objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/200x200';
                }}
              />
              <div className="card-body d-flex flex-column">
                {editingProduct?.id === product.id ? (
                  <form onSubmit={handleUpdateProduct}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editingProduct.title}
                      onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editingProduct.description}
                      onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                    <div className="mt-auto">
                      <button type="submit" className="btn btn-success me-2">Save</button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text text-muted">{product.category}</p>
                    <p className="card-text">{product.description}</p>
                    <div className="mt-auto">
                      <p className="fs-4">${product.price}</p>
                      <div className="btn-group w-100">
                        <button 
                          className="btn btn-primary"
                          onClick={() => dispatch(addToCart(product))}
                        >
                          Add to Cart
                        </button>
                        {!product.id.startsWith('fake_') && (
                          <>
                            <button 
                              className="btn btn-warning"
                              onClick={() => setEditingProduct(product)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger"
                              onClick={() => deleteMutation.mutate(product.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}