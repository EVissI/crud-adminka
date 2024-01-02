import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";


function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);

    const handleEdit = (promo) => {
        setEditMode(true);
        setSelectedPromo(promo);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/promo');
            setData(response.data);
            console.log(response)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createData = async (newData) => {
        try {
            const response = await axios.post('http://localhost:8080', newData);
            setData([...data, response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:8080/${id}`, updatedData);
            const updatedArray = data.map((item) => {
                if (item.id === id) {
                    return response.data;
                }
                return item;
            });
            setData(updatedArray);
        } catch (error) {
            console.error(error);
        } finally {
            setEditMode(false);
            setSelectedPromo(null);
        }
    };

    const deleteData = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/${id}`);
            const filteredArray = data.filter((item) => item.id !== id);
            setData(filteredArray);
        } catch (error) {
            console.error(error);
        }
    };

    const EditForm = ({ promo, updateData }) => {
        const [updatedPromo, setUpdatedPromo] = useState(promo);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setUpdatedPromo((prevPromo) => ({
                ...prevPromo,
                [name]: value,
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            updateData(promo.id, updatedPromo);
        };

        return (
            <form onSubmit={handleSubmit}>
                <label htmlFor="promo-link">Promo Link</label>
                <input
                    type="text"
                    id="promo-link"
                    name="promoLink"
                    value={updatedPromo.promoLink}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="promo-service">Promo Service</label>
                <input
                    type="text"
                    id="promo-service"
                    name="promoService"
                    value={updatedPromo.promoService}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="promo-name">Promo Name</label>
                <input
                    type="text"
                    id="promo-name"
                    name="promoName"
                    value={updatedPromo.promoName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="value">Value</label>
                <input
                    type="number"
                    id="value"
                    name="value"
                    value={updatedPromo.value}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={updatedPromo.status}
                    onChange={handleChange}
                    required
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        );
    };

        return (
        <div>
            <h1>Promo Table</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>PromoLink</th>
                        <th>PromoService</th>
                        <th>PromoName</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((promo) => (
                        <tr key={promo.id}>
                            <td>{promo.promoLink}</td>
                            <td>{promo.promoService}</td>
                            <td>{promo.promoName}</td>
                            <td>{promo.value}</td>

                            <td>{promo.status ? "Active" : "Inactive"}</td>
                            <td>
                                <button onClick={() => handleEdit(promo)}>Edit</button>
                                <button onClick={() => deleteData(promo.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {editMode && selectedPromo && (
                <EditForm promo={selectedPromo} updateData={handleUpdate} />
            )}
            <h2>Create Promo</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newData = {
                    promoName: formData.get("promo-name"),
                    promoLink: formData.get("promo-link"),
                    promoService: formData.get("promo-service"),
                    value: parseInt(formData.get("value")),
                    status: formData.get("status") === "true"

                };
                createData(newData)
            }}>
                <label htmlFor="promo-link">Promo Link</label>
                <input type="text" id="promo-link" name="promo-link" required />

                <label htmlFor="promo-name">Promo Service</label>
                <input type="text" id="promo-service" name="promo-service" required />

                <label htmlFor="promo-name">Promo Name</label>
                <input type="text" id="promo-name" name="promo-name" required />

                <label htmlFor="value">Value</label>
                <input type="number" id="value" name="value" required />

                <label htmlFor="status">Status</label>
                <select id="status" name="status" required>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <button type="submit">Create</button>
            </form>
        </div>
    );

}

export default App;
