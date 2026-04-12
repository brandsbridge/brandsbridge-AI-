import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { categories, companies } from '../data/mockData';

const CategoriesPage = () => {
  // Count companies per category
  const getCategoryCount = (categoryName: string) => {
    return companies.filter(c =>
      c.categories.some(cat => cat.toLowerCase().includes(categoryName.toLowerCase()))
    ).length;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Find manufacturers, exporters, and distributors in your industry segment.
            Click on any category to see available companies.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/companies?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>{category.companyCount} companies</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Can't Find Your Category?
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            We're constantly expanding our database. Contact us if you need suppliers
            from a specific category not listed here.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
