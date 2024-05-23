import React, { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../SupaBaseClient';
import { z } from 'zod';

type FormData = {
    username: string;
    email: string;
    address: string;
    phone: string;
    password: string;
    gender: string;
    terms: boolean;
    file: string;
    date: number;
    year: number;
    expertise: string[];
};

const formSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
    phone: z.string().min(1, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    gender: z.string().min(1, 'Gender is required'),
    file: z.string().min(1, 'File is required'),
    expertise: z.array(z.string()).min(1, 'Expertise is required')
});

const AddProduct = () => {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        address: "",
        phone: "",
        password: "",
        gender: "",
        terms: false,
        file: "",
        date: 0,
        year: 0,
        expertise: []
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (name === "expertise") {
            setFormData({
                ...formData,
                expertise: value.split(",")
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            formSchema.parse(formData);
            setErrors({});  // Clear errors if validation passes

            const { data, error } = await supabase
                .from("formdata")
                .insert(formData);

            if (error) {
                throw error;
            }

            console.log("Data added successfully:", data);
            window.location.reload()
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const errorMap = error.errors.reduce((acc: Partial<Record<keyof FormData, string>>, curr) => {
                    acc[curr.path[0] as keyof FormData] = curr.message;
                    return acc;
                }, {});
                setErrors(errorMap);
            } else {
                console.log("Error adding data:", error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Add Product</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.username && <span className="text-red-500">{errors.username}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.address && <span className="text-red-500">{errors.address}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.password && <span className="text-red-500">{errors.password}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Gender:</label>
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.gender && <span className="text-red-500">{errors.gender}</span>}
            </div>
            <div className="mb-4 flex items-center">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="mr-2" />
                <label className="text-gray-700">I accept the terms and conditions</label>
                {errors.terms && <span className="text-red-500 ml-2">{errors.terms}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">File:</label>
                <input type="text" name="file" value={formData.file} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.file && <span className="text-red-500">{errors.file}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.date && <span className="text-red-500">{errors.date}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Year:</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.year && <span className="text-red-500">{errors.year}</span>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Expertise (comma separated):</label>
                <input type="text" name="expertise" value={formData.expertise.join(",")} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                {errors.expertise && <span className="text-red-500">{errors.expertise}</span>}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Data</button>
        </form>
    );
}

export default AddProduct;
