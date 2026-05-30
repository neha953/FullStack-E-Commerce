import dao.DBConnection;
import dao.UserDAO;
import dao.ProductDAO;
import dao.OrderDAO;
import models.User;
import models.Product;
import models.Order;
import java.util.List;
import java.util.Scanner;

public class Main {
    static Scanner sc = new Scanner(System.in);
    static UserDAO userDAO = new UserDAO();
    static ProductDAO productDAO = new ProductDAO();
    static OrderDAO orderDAO = new OrderDAO();
    static User loggedInUser = null;

    public static void main(String[] args) {
        System.out.println("=============================");
        System.out.println("   WELCOME TO ECOMMERCE APP  ");
        System.out.println("=============================");

        while (true) {
            if (loggedInUser == null) {
                showLoginMenu();
            } else if (loggedInUser.getRole().equals("admin")) {
                showAdminMenu();
            } else {
                showCustomerMenu();
            }
        }
    }

    // ─── LOGIN MENU ───────────────────────────────────────
    static void showLoginMenu() {
        System.out.println("\n1. Register");
        System.out.println("2. Login");
        System.out.println("3. Exit");
        System.out.print("Choose: ");
        int choice = sc.nextInt();
        sc.nextLine();

        switch (choice) {
            case 1 -> registerUser();
            case 2 -> loginUser();
            case 3 -> {
                System.out.println("Goodbye!");
                System.exit(0);
            }
            default -> System.out.println("Invalid choice!");
        }
    }

    // ─── CUSTOMER MENU ────────────────────────────────────
    static void showCustomerMenu() {
        System.out.println("\n--- CUSTOMER MENU ---");
        System.out.println("1. View All Products");
        System.out.println("2. Place Order");
        System.out.println("3. View My Orders");
        System.out.println("4. Logout");
        System.out.print("Choose: ");
        int choice = sc.nextInt();
        sc.nextLine();

        switch (choice) {
            case 1 -> viewProducts();
            case 2 -> placeOrder();
            case 3 -> viewMyOrders();
            case 4 -> {
                loggedInUser = null;
                System.out.println("Logged out!");
            }
            default -> System.out.println("Invalid choice!");
        }
    }

    // ─── ADMIN MENU ───────────────────────────────────────
    static void showAdminMenu() {
        System.out.println("\n--- ADMIN MENU ---");
        System.out.println("1. View All Products");
        System.out.println("2. Add Product");
        System.out.println("3. Delete Product");
        System.out.println("4. Update Stock");
        System.out.println("5. View All Users");
        System.out.println("6. View All Orders");
        System.out.println("7. Logout");
        System.out.print("Choose: ");
        int choice = sc.nextInt();
        sc.nextLine();

        switch (choice) {
            case 1 -> viewProducts();
            case 2 -> addProduct();
            case 3 -> deleteProduct();
            case 4 -> updateStock();
            case 5 -> viewAllUsers();
            case 6 -> viewAllOrders();
            case 7 -> {
                loggedInUser = null;
                System.out.println("Logged out!");
            }
            default -> System.out.println("Invalid choice!");
        }
    }

    // ─── REGISTER ─────────────────────────────────────────
    static void registerUser() {
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter email: ");
        String email = sc.nextLine();
        System.out.print("Enter password: ");
        String password = sc.nextLine();
        userDAO.registerUser(name, email, password);
    }

    // ─── LOGIN ────────────────────────────────────────────
    static void loginUser() {
        System.out.print("Enter email: ");
        String email = sc.nextLine();
        System.out.print("Enter password: ");
        String password = sc.nextLine();
        loggedInUser = userDAO.loginUser(email, password);
        if (loggedInUser != null) {
            System.out.println("Welcome, " + loggedInUser.getName() + "!");
        } else {
            System.out.println("Invalid email or password!");
        }
    }

    // ─── VIEW PRODUCTS ────────────────────────────────────
    static void viewProducts() {
        List<Product> products = productDAO.getAllProducts();
        if (products.isEmpty()) {
            System.out.println("No products found!");
        } else {
            System.out.println("\n--- PRODUCTS ---");
            for (Product p : products) {
                System.out.println(p);
            }
        }
    }

    // ─── ADD PRODUCT (admin) ──────────────────────────────
    static void addProduct() {
        System.out.print("Product name: ");
        String name = sc.nextLine();
        System.out.print("Description: ");
        String desc = sc.nextLine();
        System.out.print("Price: ");
        double price = sc.nextDouble();
        System.out.print("Stock quantity: ");
        int stock = sc.nextInt();
        System.out.print("Category ID: ");
        int catId = sc.nextInt();
        sc.nextLine();
        productDAO.addProduct(name, desc, price, stock, catId);
    }

    // ─── DELETE PRODUCT (admin) ───────────────────────────
    static void deleteProduct() {
        System.out.print("Enter Product ID to delete: ");
        int id = sc.nextInt();
        sc.nextLine();
        productDAO.deleteProduct(id);
    }

    // ─── UPDATE STOCK (admin) ─────────────────────────────
    static void updateStock() {
        System.out.print("Enter Product ID: ");
        int id = sc.nextInt();
        System.out.print("Enter new stock quantity: ");
        int stock = sc.nextInt();
        sc.nextLine();
        productDAO.updateStock(id, stock);
    }

    // ─── VIEW ALL USERS (admin) ───────────────────────────
    static void viewAllUsers() {
        List<User> users = userDAO.getAllUsers();
        System.out.println("\n--- ALL USERS ---");
        for (User u : users) {
            System.out.println(u);
        }
    }

    // ─── PLACE ORDER (customer) ───────────────────────────
   static void placeOrder() {
    System.out.println("\n--- AVAILABLE PRODUCTS ---");
    List<Product> products = productDAO.getAllProducts();
    for (Product p : products) {
        System.out.println(p);
    }
    
    System.out.print("\nEnter Product ID: ");
    int productId = sc.nextInt();
    System.out.print("Enter Quantity: ");
    int qty = sc.nextInt();
    sc.nextLine();

    Product selected = null;
    for (Product p : products) {
        if (p.getId() == productId) {
            selected = p;
            break;
        }
    }

    if (selected == null) {
        System.out.println("Product not found!");
        return;
    }

    double total = selected.getPrice() * qty;
    System.out.println("Total Amount: Rs." + total);

    int addressId = 0;
    List<Order> myOrders = orderDAO.getOrdersByUser(loggedInUser.getId());
    addressId = 1;

    orderDAO.placeOrder(loggedInUser.getId(), addressId, total);
}

    // ─── VIEW MY ORDERS (customer) ────────────────────────
    static void viewMyOrders() {
        List<Order> orders = orderDAO.getOrdersByUser(loggedInUser.getId());
        if (orders.isEmpty()) {
            System.out.println("No orders found!");
        } else {
            System.out.println("\n--- MY ORDERS ---");
            for (Order o : orders) {
                System.out.println(o);
            }
        }
    }

    // ─── VIEW ALL ORDERS (admin) ──────────────────────────
    static void viewAllOrders() {
        System.out.print("Enter User ID to view orders (0 for all): ");
        int userId = sc.nextInt();
        sc.nextLine();
        List<Order> orders = orderDAO.getOrdersByUser(userId);
        System.out.println("\n--- ALL ORDERS ---");
        for (Order o : orders) {
            System.out.println(o);
        }
    }
}