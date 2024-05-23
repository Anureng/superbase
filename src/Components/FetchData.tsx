import React, { useEffect, useState } from 'react';
import { supabase } from '../SupaBaseClient';

type Product = {
    id: number;
    [key: string]: any;
};

const FetchData = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});

    async function getProducts() {
        try {
            const { data, error } = await supabase
                .from('formdata')
                .select('*')
                .limit(10);

            if (error) throw error;
            if (data) {
                setProducts(data);
            }

            console.log(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            const { data, error } = await supabase
                .from('formdata')
                .update(formData)
                .eq('id', editingProduct.id);

            if (error) throw error;

            setProducts(products.map(p => (p.id === editingProduct.id ? { ...p, ...formData } : p)));
            setEditingProduct(null);
            setFormData({});
        } catch (error: any) {
            setError(error.message);
        }
    };

    const closeModal = () => {
        setEditingProduct(null);
        setFormData({});
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Fetched Products</h1>
            <ul className="space-y-4">
                {products.map((product) => (
                    <li key={product.id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                        {Object.keys(product).map((key) => (
                            <div key={key} className="flex justify-between">
                                <span className="font-semibold">{key}:</span>
                                <span>{String(product[key])}</span>
                            </div>
                        ))}
                        <button
                            onClick={() => handleEdit(product)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>

            {editingProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                        <form onSubmit={handleSubmit}>
                            {Object.keys(editingProduct).map((key) => (
                                key !== 'id' && (
                                    <div key={key} className="mb-4">
                                        <label className="block text-gray-700 mb-2">{key}:</label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={formData[key] as string || ''}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                )
                            ))}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FetchData;
