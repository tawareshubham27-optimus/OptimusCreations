import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminVerification } from "@/lib/useAdminVerification";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Plus, Save, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  deliveryTime: string;
  popular: boolean;
}

// Available product categories
const PRODUCT_CATEGORIES = [
  { id: "architectural", name: "Architectural Models" },
  { id: "miniatures", name: "Miniatures" },
  { id: "keychains", name: "Keychains" },
  { id: "gifts", name: "Custom Gifts" },
  { id: "prototypes", name: "Prototypes" }
];

// Product form component
function ProductForm({ product, onSubmit, buttonText }: { 
  product?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  buttonText: string;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "architectural",
    price: product?.price || "",
    image: product?.image || "",
    description: product?.description || "",
    rating: product?.rating || 5,
    deliveryTime: product?.deliveryTime || "",
    popular: product?.popular || false
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(product?.image || "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleCategoryChange(value: string) {
    setForm(prev => ({
      ...prev,
      category: value
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Update form with temporary URL (will be replaced with actual URL after upload)
      setForm(prev => ({
        ...prev,
        image: url
      }));
    }
  }

  function removeImage() {
    // Reset file input
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    
    // Clean up the old preview URL
    if (previewUrl && !product?.image) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Reset image state
    setImageFile(null);
    setPreviewUrl("");
    setForm(prev => ({
      ...prev,
      image: ""
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    let imageUrl = form.image;
    
    // Handle image upload if there's a new file
    if (imageFile) {
      // In a real application, you would upload the image to your server or cloud storage
      // For now, we'll just use the preview URL
      imageUrl = previewUrl;
    }

    onSubmit({
      ...form,
      image: imageUrl
    });

    if (!product) {
      // Reset form only for new products
      setForm({
        name: "",
        category: "architectural",
        price: "",
        image: "",
        description: "",
        rating: 5,
        deliveryTime: "",
        popular: false
      });
      setImageFile(null);
      setPreviewUrl("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select
            value={form.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Price</label>
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Image</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById("imageUpload")?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={removeImage}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              )}
            </div>
            {previewUrl && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Rating (1-5)</label>
          <Input
            name="rating"
            type="number"
            value={form.rating}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Delivery Time</label>
          <Input
            name="deliveryTime"
            value={form.deliveryTime}
            onChange={handleChange}
            placeholder="e.g., 3-5 days"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            name="popular"
            type="checkbox"
            checked={form.popular}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <label className="text-sm font-medium">Popular Product</label>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  );
}

export default function AdminPage() {
  const { isVerified, error, handleVerify } = useAdminVerification();
  const [adminPassword, setAdminPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Admin: Add product
  function handleAddProduct(productData: Omit<Product, 'id'>) {
    const newProduct = {
      ...productData,
      id: Date.now()
    };
    setProducts(prev => [...prev, newProduct]);
  }

  // Admin: Update product
  function handleUpdateProduct(productData: Omit<Product, 'id'>) {
    if (!editingProduct) return;
    
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id ? { ...productData, id: p.id } : p
    ));
    setEditingProduct(null);
  }

  // Admin: Delete product
  function handleDeleteProduct(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Admin Password</label>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleVerify(adminPassword)}
                >
                  Verify
                </Button>
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button onClick={() => navigate("/catalog")}>View Catalog</Button>
        </div>

        {/* Add/Edit Product Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              buttonText={editingProduct ? "Update Product" : "Add Product"}
            />
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video bg-muted relative rounded-lg overflow-hidden mb-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <CardTitle className="flex justify-between items-start">
                  <span>{product.name}</span>
                  <span className="text-primary">{product.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>{product.category}</Badge>
                  <Badge variant="secondary">{product.deliveryTime}</Badge>
                  {product.popular && (
                    <Badge variant="destructive">Popular</Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}