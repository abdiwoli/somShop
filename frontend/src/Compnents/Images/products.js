// fetchProducts.js
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Store the fetched data in the `products` array
        products = await response.json();
    } catch (error) {
        console.error('An error occurred while fetching the products:', error);
    }
}

// Immediately fetch the products
fetchProducts();

export async function getProducts() {
    // Ensure that products are fetched before returning
    if (products.length === 0) {
        await fetchProducts();
    }
    return products;
}
