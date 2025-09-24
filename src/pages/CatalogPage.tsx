import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  Building2,
  Gift,
  Star,
  Clock,
  Eye
} from "lucide-react";
import { productApi, categoryApi } from '../lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: Category;
  materialType: string;
  inStock: boolean;
  printTimeHours: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  products?: Product[];
}

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getAllProducts(),
          categoryApi.getAllCategories(),
        ]);
        setProducts(productsRes.data);
        setCategories([
          { id: 0, name: "All Products", description: "All products", imageUrl: "" },
          ...categoriesRes.data
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const response = await productApi.getAllProducts();
      setProducts(response.data);
      return;
    }
    try {
      setLoading(true);
      const response = await productApi.searchProducts(searchTerm);
      setProducts(response.data.content);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      if (categoryId === "all") {
        const response = await productApi.getAllProducts();
        setProducts(response.data);
      } else {
        const response = await productApi.getProductsByCategory(Number(categoryId));
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Product 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Catalog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of 3D printed products and get inspiration for your next project.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <h3 className="font-semibold">Categories</h3>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id === 0 ? "all" : category.id.toString())}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-smooth hover:bg-accent/50 ${
                      selectedCategory === (category.id === 0 ? "all" : category.id.toString())
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    {category.products && (
                      <Badge variant="secondary" className="text-xs">
                        {category.products.length}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "all" ? "All Products" : categories.find(c => c.id.toString() === selectedCategory)?.name}
                </h2>
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                </p>
              </div>
              
              <Button variant="outline" size="sm">
                Sort by: Popular
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-card-hover transition-smooth overflow-hidden">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={product.imageUrls?.[0] || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.inStock && (
                      <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                        In Stock
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="w-8 h-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-lg font-bold text-primary">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">{product.materialType}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">~{product.printTimeHours}h print time</span>
                      </div>
                    </div>

                    <Button className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default CatalogPage;