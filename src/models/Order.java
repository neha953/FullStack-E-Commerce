package models;

public class Order {
    private int id;
    private int userId;
    private double totalAmount;
    private String status;
    private String createdAt;

    public Order(int id, int userId, double totalAmount, String status, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public int getUserId() { return userId; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public String getCreatedAt() { return createdAt; }

    public String toString() {
        return "Order ID: " + id + " | User ID: " + userId + 
               " | Total: $" + totalAmount + " | Status: " + status;
    }
}