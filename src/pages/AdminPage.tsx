import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminVerification } from "@/lib/useAdminVerification";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Plus, Save, Upload, Loader2 } from "lucide-react";
import { contactApi, fileApi } from "@/lib/api";
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

// File upload response interface (matches contact page format)
interface FileUploadResponse {
  id: number;
  name: string;
  url?: string;
  path?: string;
}

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setUploadError('Please select a valid image file');
        return;
      }

      // Validate file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setUploadError('File size must be less than 100MB');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('files', selectedFile);
        
        setIsUploading(true);
        setUploadError("");
        
         const response = await fetch('http://localhost:8080/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log('File upload response:', data);
        
        if (response.ok && Array.isArray(data) && data.length > 0) {
          // Set the uploaded file URL
          const uploadedUrl = data[0].url || data[0].path || '';
          setForm(prev => ({
            ...prev,
            image: uploadedUrl
          }));
          setPreviewUrl(uploadedUrl);
          setImageFile(null); // Clear the file since it's uploaded
        } else {
          console.error('Upload response:', data);
          setUploadError('Could not process upload response');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  function removeImage() {
    // Reset file input
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    
    // Clean up the old preview URL if it's a blob URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Reset image state
    setImageFile(null);
    setPreviewUrl("");
    setUploadError("");
    setForm(prev => ({
      ...prev,
      image: ""
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploadError("");
    
    let imageUrl = form.image;
    
    // Handle image upload if there's a new file
    if (imageFile) {
      setIsUploading(true);
      
      try {
        const uploadResult = await uploadFile(imageFile);
        
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          
          // Clean up the preview URL since we now have the actual URL
          if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl(uploadResult.url);
        } else {
          setUploadError(uploadResult.error || 'Failed to upload image');
          setIsUploading(false);
          return;
        }
      } catch (error) {
        setUploadError('Failed to upload image. Please try again.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
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
      setUploadError("");
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
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById("imageUpload")?.click()}
                className="flex-1"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={removeImage}
                  disabled={isUploading}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              )}
            </div>
            {uploadError && (
              <p className="text-sm text-red-500">{uploadError}</p>
            )}
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
      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
}

export default function AdminPage() {
  const { isVerified, error, handleVerify } = useAdminVerification();
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'products' | 'messages'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [responseText, setResponseText] = useState("");
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

  // Admin: Update message status
  function handleUpdateMessageStatus(id: number, status: MessageStatus) {
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, status } : m
    ));
  }

  // Admin: Add response to message
  function handleAddMessageResponse(id: number, response: string) {
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, response, status: MessageStatus.Resolved } : m
    ));
    setSelectedMessage(null);
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
          <div className="space-x-4">
            <Button 
              variant={activeTab === 'products' ? 'default' : 'outline'}
              onClick={() => setActiveTab('products')}
            >
              Product Management
            </Button>
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'outline'}
              onClick={() => setActiveTab('messages')}
            >
              User Messages
              {messages.filter(m => m.status === MessageStatus.New).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {messages.filter(m => m.status === MessageStatus.New).length}
                </Badge>
              )}
            </Button>
          </div>
          {activeTab === 'products' && (
            <Button onClick={() => navigate("/catalog")}>View Catalog</Button>
          )}
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

        {/* Messages Section */}
        {activeTab === 'messages' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Messages List */}
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map(message => (
                    <Card 
                      key={message.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${selectedMessage?.id === message.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{message.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                          </div>
                          <Badge 
                            variant={message.status === MessageStatus.New ? 'destructive' : 
                                   message.status === MessageStatus.InProgress ? 'default' : 'secondary'}
                          >
                            {message.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{message.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(message.createdAt).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Detail */}
            {selectedMessage && (
              <Card>
                <CardHeader>
                  <CardTitle>Message Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">From</h3>
                    <p>{selectedMessage.name} ({selectedMessage.email})</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Message</h3>
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value: MessageStatus) => handleUpdateMessageStatus(selectedMessage.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MessageStatus).map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedMessage.response ? (
                    <div>
                      <h3 className="font-semibold">Your Response</h3>
                      <p className="whitespace-pre-wrap">{selectedMessage.response}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Respond</h3>
                      <Input
                        as="textarea"
                        placeholder="Type your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        className="w-full" 
                        onClick={() => handleAddMessageResponse(selectedMessage.id, responseText)}
                      >
                        Send Response
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Products List */}
        {activeTab === 'products' && (
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
        )}
      </div>
    </div>
  );
}