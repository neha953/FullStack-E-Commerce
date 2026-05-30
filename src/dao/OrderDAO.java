package dao;

import models.Order;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    public boolean placeOrder(int userId, int addressId, double totalAmount) {
        String sql = "INSERT INTO orders (user_id, address_id, total_amount, status) VALUES (?, ?, ?, 'pending')";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setInt(2, addressId);
            ps.setDouble(3, totalAmount);
            ps.executeUpdate();
            System.out.println("Order placed successfully!");
            return true;
        } catch (SQLException e) {
            System.out.println("Order failed: " + e.getMessage());
            return false;
        }
    }

    public List<Order> getOrdersByUser(int userId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE user_id = ?";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                orders.add(new Order(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getDouble("total_amount"),
                    rs.getString("status"),
                    rs.getString("created_at")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return orders;
    }

    public boolean updateOrderStatus(int orderId, String status) {
        String sql = "UPDATE orders SET status = ? WHERE id = ?";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, status);
            ps.setInt(2, orderId);
            ps.executeUpdate();
            System.out.println("Order status updated!");
            return true;
        } catch (SQLException e) {
            System.out.println("Update failed: " + e.getMessage());
            return false;
        }
    }
    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders";
        try {
            Connection conn = DBConnection.getConnection();
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(sql);
            while (rs.next()) {
                orders.add(new Order(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getDouble("total_amount"),
                    rs.getString("status"),
                    rs.getString("created_at")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return orders;
    }
}