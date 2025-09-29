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
import { Product, Category, ProductSearchParams } from '../lib/types';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getAllProducts(),
          categoryApi.getAllCategories(),
        ]);
        
        if (productsRes.data.status === 'success' && categoriesRes.data.status === 'success') {
          setProducts(productsRes.data.data || []);
          setCategories([
            { id: 0, name: "All Products", description: "All products", imageUrl: "", createdAt: new Date().toISOString() },
            ...(categoriesRes.data.data || [])
          ]);
        } else {
          setError('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams: ProductSearchParams = {
        keyword: searchTerm,
        page: 0,
        size: 10,
        sortBy: 'name',
        sortDirection: 'asc'
      };

      if (!searchTerm.trim()) {
        const response = await productApi.getAllProducts();
        if (response.data.status === 'success') {
          setProducts(response.data.data || []);
        }
      } else {
        const response = await productApi.searchProducts(searchParams);
        if (response.data.status === 'success') {
          setProducts(response.data.data?.content || []);
        }
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategory(categoryId);

      const response = categoryId === "all" 
        ? await productApi.getAllProducts()
        : await productApi.getProductsByCategory(Number(categoryId));

      if (response.data.status === 'success') {
        setProducts(response.data.data || []);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
      setError('Failed to filter products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term locally
  const filteredProducts = (products || []).filter(product => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">{error}</h3>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
              <Button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
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
                     className="w-full h-full object-contain bg-muted group-hover:scale-105 transition-transform duration-500"
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
                        <div className="text-lg font-bold text-primary">Rs {product.price.toFixed(2)}</div>
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
                        <span className="text-sm">~{product.printTimeHours} Days to Deliver</span>
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
                    handleSearch();
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