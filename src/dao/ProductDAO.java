package dao;

import models.Product;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT * FROM products";
        try {
            Connection conn = DBConnection.getConnection();
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(sql);
            while (rs.next()) {
                products.add(new Product(
                    rs.getInt("id"),
                    rs.getInt("category_id"),
                    rs.getString("name"),
                    rs.getString("description"),
                    rs.getDouble("price"),
                    rs.getInt("stock_qty"),
                    rs.getString("emoji")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return products;
    }

    public boolean addProduct(String name, String description, double price, int stock, int categoryId) {
        String sql = "INSERT INTO products (name, description, price, stock_qty, category_id) VALUES (?, ?, ?, ?, ?)";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, name);
            ps.setString(2, description);
            ps.setDouble(3, price);
            ps.setInt(4, stock);
            ps.setInt(5, categoryId);
            ps.executeUpdate();
            System.out.println("Product added successfully!");
            return true;
        } catch (SQLException e) {
            System.out.println("Failed to add product: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteProduct(int productId) {
        String sql = "DELETE FROM products WHERE id = ?";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, productId);
            ps.executeUpdate();
            System.out.println("Product deleted!");
            return true;
        } catch (SQLException e) {
            System.out.println("Delete failed: " + e.getMessage());
            return false;
        }
    }

    public boolean updateStock(int productId, int newStock) {
        String sql = "UPDATE products SET stock_qty = ? WHERE id = ?";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, newStock);
            ps.setInt(2, productId);
            ps.executeUpdate();
            System.out.println("Stock updated!");
            return true;
        } catch (SQLException e) {
            System.out.println("Update failed: " + e.getMessage());
            return false;
        }
    }
}