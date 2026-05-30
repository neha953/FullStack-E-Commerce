import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.google.gson.Gson;
import dao.ProductDAO;
import dao.UserDAO;
import dao.OrderDAO;
import dao.ReviewDAO;
import models.Product;
import models.User;
import models.Order;
import java.io.*;
import java.net.InetSocketAddress;
import java.util.*;

public class ApiServer {
    static Gson gson = new Gson();
    static ProductDAO productDAO = new ProductDAO();
    static UserDAO userDAO = new UserDAO();
    static OrderDAO orderDAO = new OrderDAO();
    static ReviewDAO reviewDAO = new ReviewDAO();

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // ── DELETE PRODUCT (must be before /api/products) ──
        server.createContext("/api/products/delete", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                try {
                    Map map = gson.fromJson(readBody(ex), Map.class);
                    int id = Integer.parseInt(map.get("id").toString());
                    boolean ok = productDAO.deleteProduct(id);
                    sendResponse(ex, 200, gson.toJson(Map.of("success", ok)));
                } catch (Exception e) {
                    sendResponse(ex, 200, gson.toJson(Map.of("success", false, "error", e.getMessage())));
                }
            }
        });

        // ── PRODUCTS ──────────────────────────────
        server.createContext("/api/products", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                if (ex.getRequestMethod().equals("GET")) {
                    sendResponse(ex, 200, gson.toJson(productDAO.getAllProducts()));
                } else if (ex.getRequestMethod().equals("POST")) {
                    Map map = gson.fromJson(readBody(ex), Map.class);
                    boolean ok = productDAO.addProduct(
                        (String)map.get("name"),
                        (String)map.get("description"),
                        Double.parseDouble(map.get("price").toString()),
                        Integer.parseInt(map.get("stock").toString()),
                        Integer.parseInt(map.get("categoryId").toString())
                    );
                    sendResponse(ex, 200, gson.toJson(Map.of("success", ok)));
                }
            }
        });

        // ── LOGIN ─────────────────────────────────
        server.createContext("/api/login", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                Map map = gson.fromJson(readBody(ex), Map.class);
                User user = userDAO.loginUser((String)map.get("email"), (String)map.get("password"));
                if (user != null) {
                    Map<String, Object> res = new HashMap<>();
                    res.put("success", true);
                    res.put("id", user.getId());
                    res.put("name", user.getName());
                    res.put("email", user.getEmail());
                    res.put("role", user.getRole());
                    sendResponse(ex, 200, gson.toJson(res));
                } else {
                    sendResponse(ex, 200, gson.toJson(Map.of("success", false)));
                }
            }
        });

        // ── REGISTER ──────────────────────────────
        server.createContext("/api/register", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                Map map = gson.fromJson(readBody(ex), Map.class);
                boolean ok = userDAO.registerUser(
                    (String)map.get("name"),
                    (String)map.get("email"),
                    (String)map.get("password")
                );
                sendResponse(ex, 200, gson.toJson(Map.of("success", ok)));
            }
        });

        // ── ALL USERS ─────────────────────────────
        server.createContext("/api/users", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                sendResponse(ex, 200, gson.toJson(userDAO.getAllUsers()));
            }
        });

        // ── PLACE ORDER ───────────────────────────
        server.createContext("/api/orders/place", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                Map map = gson.fromJson(readBody(ex), Map.class);
                boolean ok = orderDAO.placeOrder(
                    Integer.parseInt(map.get("userId").toString()),
                    Integer.parseInt(map.get("addressId").toString()),
                    Double.parseDouble(map.get("total").toString())
                );
                sendResponse(ex, 200, gson.toJson(Map.of("success", ok)));
            }
        });

        // ── UPDATE ORDER STATUS ───────────────────
        server.createContext("/api/orders/status", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                Map map = gson.fromJson(readBody(ex), Map.class);
                boolean ok = orderDAO.updateOrderStatus(
                    Integer.parseInt(map.get("orderId").toString()),
                    (String)map.get("status")
                );
                sendResponse(ex, 200, gson.toJson(Map.of("success", ok)));
            }
        });

        // ── ALL ORDERS (admin) ────────────────────
        server.createContext("/api/orders/all", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                sendResponse(ex, 200, gson.toJson(orderDAO.getAllOrders()));
            }
        });

        // ── ORDERS BY USER ────────────────────────
        server.createContext("/api/orders", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                String path = ex.getRequestURI().getPath();
                String[] parts = path.split("/");
                int userId = Integer.parseInt(parts[parts.length - 1]);
                sendResponse(ex, 200, gson.toJson(orderDAO.getOrdersByUser(userId)));
            }
        });

        // ── ADD REVIEW ────────────────────────────
        server.createContext("/api/reviews/add", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                Map map = gson.fromJson(readBody(ex), Map.class);
                boolean ok = reviewDAO.addReview(
                    Integer.parseInt(map.get("userId").toString()),
                    Integer.parseInt(map.get("productId").toString()),
                    Integer.parseInt(map.get("rating").toString()),
                    (String)map.get("comment")
                );
                sendResponse(ex, 200, gson.toJson(Map.of("success", ok)));
            }
        });

        // ── GET REVIEWS ───────────────────────────
        server.createContext("/api/reviews", new HttpHandler() {
            public void handle(HttpExchange ex) throws IOException {
                addCORS(ex);
                if (ex.getRequestMethod().equals("OPTIONS")) {
                    ex.sendResponseHeaders(200, 0);
                    ex.getResponseBody().close();
                    return;
                }
                String path = ex.getRequestURI().getPath();
                String[] parts = path.split("/");
                int productId = Integer.parseInt(parts[parts.length - 1]);
                sendResponse(ex, 200, gson.toJson(reviewDAO.getReviewsByProduct(productId)));
            }
        });

        server.start();
        System.out.println("Server running at http://localhost:8080");
    }

    static void addCORS(HttpExchange ex) {
        ex.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
        ex.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        ex.getResponseHeaders().add("Content-Type", "application/json");
    }

    static String readBody(HttpExchange ex) throws IOException {
        return new String(ex.getRequestBody().readAllBytes());
    }

    static void sendResponse(HttpExchange ex, int code, String body) throws IOException {
        byte[] bytes = body.getBytes();
        ex.sendResponseHeaders(code, bytes.length);
        ex.getResponseBody().write(bytes);
        ex.getResponseBody().close();
    }
}