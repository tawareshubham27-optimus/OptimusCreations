import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminVerification } from "@/lib/useAdminVerification";
import { productApi, categoryApi, fileApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Plus, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// Message status type
enum MessageStatus {
  New = 'new',
  InProgress = 'in-progress',
  Resolved = 'resolved'
}

// Message interface
interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  response?: string;
}

// Define product type (matching backend)
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  categoryId: number;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  featured: boolean;
  inStock: boolean;
  rating?: number;
  deliveryTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category interface
interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

// Product DTO for API calls
interface ProductDTO {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  featured: boolean;
  inStock: boolean;
  rating?: number;
  deliveryTime?: string;
}

// Product form component
function ProductForm({ 
  product, 
  onSubmit, 
  buttonText,
  categories,
  loading 
}: { 
  product?: Product;
  onSubmit: (data: ProductDTO) => Promise<void>;
  buttonText: string;
  categories: Category[];
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    imageUrls: product?.imageUrls || "",
    categoryId: product?.categoryId || (categories[0]?.id || 1),
    featured: product?.featured || false,
    inStock: product?.inStock !== false,
    rating: product?.rating || 5,
    deliveryTime: product?.deliveryTime || ""
  });

  const [previewUrl, setPreviewUrl] = useState(product?.imageUrls || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrls: product.imageUrls || "",
        categoryId: product.categoryId,
        featured: product.featured,
        inStock: product.inStock,
        rating: product.rating || 5,
        deliveryTime: product.deliveryTime || ""
      });
      setPreviewUrl(product.imageUrls || "");
    }
  }, [product]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value
    }));
  }

  function handleCategoryChange(value: string) {
    setForm(prev => ({
      ...prev,
      categoryId: parseInt(value)
    }));
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const formData = new FormData();

    try {
      const response = await fileApi.uploadFile(files);

      if (response.ok) {
        const data = await response.json();

        // Assuming backend returns [{ id, fileName, s3Url }]
        const uploadedUrls = data.map((f) => f.s3Url);

        setForm((prev) => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), ...uploadedUrls],
        }));

        setPreviewUrl((prev) => [...prev, ...uploadedUrls]);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  function removeImage() {
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    
    setPreviewUrl("");
    setUploadError("");
    setForm(prev => ({ ...prev, imageUrls: [] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await onSubmit(form);
      if (!product) {
        setForm({
          name: "",
          description: "",
          price: 0,
          imageUrls: [],
          categoryId: categories[0]?.id || 1,
          featured: false,
          inStock: true,
          rating: 5,
          deliveryTime: ""
        });
        setPreviewUrl("");
        setUploadError("");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name, Category, Price, Rating, DeliveryTime Inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required disabled={loading} />
        </div>
        <div>
          <label className="text-sm font-medium">Category *</label>
          <Select value={form.categoryId.toString()} onValueChange={handleCategoryChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Price *</label>
          <Input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <label className="text-sm font-medium">Rating</label>
          <Input name="rating" type="number" value={form.rating} onChange={handleChange} min={1} max={5} step={0.1} disabled={loading} />
        </div>
        <div>
          <label className="text-sm font-medium">Delivery Time</label>
          <Input name="deliveryTime" value={form.deliveryTime} onChange={handleChange} placeholder="e.g., 3-5 days" disabled={loading} />
        </div>
        <div>
          <label className="text-sm font-medium">Image</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="imageUpload" disabled={isUploading || loading} />
              <Button type="button" variant="secondary" onClick={() => document.getElementById("imageUpload")?.click()} className="flex-1" disabled={isUploading || loading}>
                {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Uploading...</> : <><Upload className="w-4 h-4 mr-2"/>Upload Image</>}
              </Button>
              {previewUrl && <Button type="button" variant="destructive" onClick={removeImage} disabled={isUploading || loading}><Trash className="w-4 h-4"/></Button>}
            </div>
            {uploadError && <Alert variant="destructive"><AlertCircle className="h-4 w-4"/><AlertDescription>{uploadError}</AlertDescription></Alert>}
            {previewUrl && <div className="aspect-video bg-muted rounded-lg overflow-hidden"><img src={previewUrl[0]} alt="Preview" className="w-full h-full object-cover"/></div>}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description" required disabled={loading} className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} disabled={loading} className="rounded border-gray-300"/>
            <label className="text-sm font-medium">Featured Product</label>
          </div>
          <div className="flex items-center space-x-2">
            <input name="inStock" type="checkbox" checked={form.inStock} onChange={handleChange} disabled={loading} className="rounded border-gray-300"/>
            <label className="text-sm font-medium">In Stock</label>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading || isUploading}>{buttonText}</Button>
    </form>
  );
}

export default function AdminPage() {
  const { isVerified, error: verificationError, handleVerify } = useAdminVerification();
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'products' | 'messages'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(""); // Renamed
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isVerified) {
      loadProducts();
      loadCategories();
    }
  }, [isVerified]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts();
      if (response.data.status === 'success') {
          setProducts(response.data.data || []);
         
        }
    } catch (error) { setLocalError(error.message || 'Failed to load products'); } 
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      if (response.data.status === 'success') setCategories(response.data.data || []);
    } catch (error) { console.error(error); }
  };

  const handleAddProduct = async (productData: ProductDTO) => {
    try {
      setLoading(true);
      setLocalError("");
      const response = await productApi.createProduct(productData);
      if (response.data.status === 'success') {
        setSuccess("Product created successfully!");
        await loadProducts();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) { setLocalError(error.message || 'Failed to create product'); setTimeout(() => setLocalError(""), 5000); }
    finally { setLoading(false); }
  };

  const handleUpdateProduct = async (productData: ProductDTO) => {
    if (!editingProduct) return;
    try {
      setLoading(true);
      setLocalError("");
      const response = await productApi.updateProduct(editingProduct.id, productData);
      if (response.data.status === 'success') {
        setSuccess("Product updated successfully!");
        setEditingProduct(null);
        await loadProducts();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) { setLocalError(error.message || 'Failed to update product'); setTimeout(() => setLocalError(""), 5000); }
    finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      setLocalError("");
      const response = await productApi.deleteProduct(id);
      if (response.data.status === 'success') { setSuccess("Product deleted successfully!"); await loadProducts(); setTimeout(() => setSuccess(""), 3000); }
    } catch (error) { setLocalError(error.message || 'Failed to delete product'); setTimeout(() => setLocalError(""), 5000); }
    finally { setLoading(false); }
  };

  const handleToggleFeatured = async (id: number) => {
    try { const response = await productApi.toggleFeatured(id); if (response.data.status === 'success') await loadProducts(); }
    catch (error) { setLocalError(error.message || 'Failed to toggle featured status'); setTimeout(() => setLocalError(""), 5000); }
  };

  const handleToggleStock = async (id: number, inStock: boolean) => {
    try { const response = await productApi.updateStock(id, inStock); if (response.data.status === 'success') await loadProducts(); }
    catch (error) { setLocalError(error.message || 'Failed to toggle stock status'); setTimeout(() => setLocalError(""), 5000); }
  };

  const handleUpdateMessageStatus = (id: number, status: MessageStatus) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleAddMessageResponse = (id: number, response: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, response, status: MessageStatus.Resolved } : m));
    setSelectedMessage(null);
    setResponseText("");
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6">
          <Card>
            <CardHeader><CardTitle>Admin Verification</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input type="password" placeholder="Enter admin password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
                <Button className="w-full" onClick={() => handleVerify(adminPassword)}>Verify</Button>
                {verificationError && <Alert variant="destructive"><AlertCircle className="h-4 w-4"/><AlertDescription>{verificationError}</AlertDescription></Alert>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && <Alert className="mb-6 border-green-200 bg-green-50"><CheckCircle className="h-4 w-4 text-green-600"/><AlertDescription className="text-green-800">{success}</AlertDescription></Alert>}
        {localError && <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4"/><AlertDescription>{localError}</AlertDescription></Alert>}
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button variant={activeTab === 'products' ? 'default' : 'outline'} onClick={() => setActiveTab('products')}>Products</Button>
          <Button variant={activeTab === 'messages' ? 'default' : 'outline'} onClick={() => setActiveTab('messages')}>Messages</Button>
        </div>

        {activeTab === 'products' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle></CardHeader>
              <CardContent>
                <ProductForm
                  product={editingProduct || undefined}
                  categories={categories}
                  buttonText={editingProduct ? "Update Product" : "Add Product"}
                  loading={loading}
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                />
              </CardContent>
            </Card>

            {products.map(product => (
              <Card key={product.id} className="relative">
                {product.featured && <Badge className="absolute top-2 right-2 bg-yellow-300 text-yellow-800">Featured</Badge>}
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.imageUrls && product.imageUrls.length > 0 && <img src={product.imageUrls[0]} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2" />}
                  <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                  <p className="text-sm font-medium">Price: ₹{product.price.toFixed(2)}</p>
                  <p className="text-sm font-medium">Category: {product.category?.name || "N/A"}</p>
                  <div className="flex justify-between mt-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}><Edit className="w-4 h-4"/></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}><Trash className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" onClick={() => handleToggleFeatured(product.id)}>{product.featured ? "Unfeature" : "Feature"}</Button>
                    <Button size="sm" onClick={() => handleToggleStock(product.id, !product.inStock)}>{product.inStock ? "Mark Out of Stock" : "Mark In Stock"}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              {messages.map(msg => (
                <Card key={msg.id} className={`cursor-pointer ${selectedMessage?.id === msg.id ? 'border-2 border-blue-400' : ''}`} onClick={() => setSelectedMessage(msg)}>
                  <CardContent>
                    <p className="font-medium">{msg.name} ({msg.email})</p>
                    <p className="text-sm text-muted-foreground">{msg.message.slice(0,50)}...</p>
                    <Badge className="mt-2">{msg.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            {selectedMessage && (
              <Card className="md:col-span-2 space-y-4">
                <CardHeader><CardTitle>Message Details</CardTitle></CardHeader>
                <CardContent>
                  <p><strong>Name:</strong> {selectedMessage.name}</p>
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  <p><strong>Message:</strong> {selectedMessage.message}</p>
                  <Select value={selectedMessage.status} onValueChange={(v) => handleUpdateMessageStatus(selectedMessage.id, v as MessageStatus)}>
                    <SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <textarea placeholder="Type your response..." value={responseText} onChange={e => setResponseText(e.target.value)} className="w-full h-32 border rounded p-2"/>
                  <Button onClick={() => handleAddMessageResponse(selectedMessage.id, responseText)}>Send Response</Button>
                  {selectedMessage.response && (
                    <div className="mt-2 p-2 border rounded bg-green-50">
                      <strong>Response:</strong>
                      <p>{selectedMessage.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
