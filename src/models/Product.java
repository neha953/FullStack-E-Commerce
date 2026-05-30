package models;

public class Product {
    private int id;
    private int categoryId;
    private String name;
    private String description;
    private double price;
    private int stockQty;
    private String emoji;

    public Product(int id, int categoryId, String name, String description, double price, int stockQty, String emoji) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQty = stockQty;
        this.emoji = emoji;
    }

    public int getId() { return id; }
    public int getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public int getStockQty() { return stockQty; }
    public String getEmoji() { return emoji; }

    public String toString() {
        return "ID: " + id + " | " + name + " | Price: Rs." + price + " | Stock: " + stockQty;
    }
}