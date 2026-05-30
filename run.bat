@echo off
set PATH=%PATH%;C:\Users\vneha\Downloads\jdk-21_windows-x64_bin\jdk-21.0.11\bin
cd C:\Users\vneha\OneDrive\Desktop\ecommerce-java
echo Compiling...
javac -cp "lib\mysql-connector-j-9.7.0.jar;lib\gson-2.10.1.jar" -d out src\models\User.java src\models\Product.java src\models\Order.java src\dao\DBConnection.java src\dao\UserDAO.java src\dao\ProductDAO.java src\dao\OrderDAO.java src\dao\ReviewDAO.java src\ApiServer.java
echo Starting server...
java -cp "out;lib\mysql-connector-j-9.7.0.jar;lib\gson-2.10.1.jar" ApiServer
pause