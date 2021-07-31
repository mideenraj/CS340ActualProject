
"""This file holds variables that be accessed from all functions of other .py files, regardless of scope."""

# ----------------- Site URL construction -----------------
# ---Step 1: Specify server and port number (!!! Change these to match your server and port)
flip_server = 3         # Choose your flip server (1, 2, or 3)
port_num = 1028         # Choose a port number of your choice


# ---Step 2: initialize variables (!!! Don't change any of these)
baseUrl = f"http://flip{flip_server}.engr.oregonstate.edu:{port_num}/"
customers_subpage = baseUrl + "customers"
orders_subpage = baseUrl + "orders"
products_subpage = baseUrl + "products"
departments_subpage = baseUrl + "departments"
seasons_subpage = baseUrl + "seasons"
subpages = [baseUrl, customers_subpage, orders_subpage, products_subpage, departments_subpage, seasons_subpage]
