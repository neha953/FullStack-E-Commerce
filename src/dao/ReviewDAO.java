package dao;

import java.sql.*;
import java.util.*;

public class ReviewDAO {

    public boolean addReview(int userId, int productId, int rating, String comment) {
        String sql = "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setInt(2, productId);
            ps.setInt(3, rating);
            ps.setString(4, comment);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println("Review failed: " + e.getMessage());
            return false;
        }
    }

    public List<Map<String, Object>> getReviewsByProduct(int productId) {
        List<Map<String, Object>> reviews = new ArrayList<>();
        String sql = "SELECT r.*, u.name as userName FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?";
        try {
            Connection conn = DBConnection.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, productId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> review = new HashMap<>();
                review.put("id", rs.getInt("id"));
                review.put("rating", rs.getInt("rating"));
                review.put("comment", rs.getString("comment"));
                review.put("userName", rs.getString("userName"));
                review.put("createdAt", rs.getString("created_at"));
                reviews.add(review);
            }
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }
        return reviews;
    }
}