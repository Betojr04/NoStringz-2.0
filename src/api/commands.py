import click
from api.models import db, User
import flask
"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    # @click.argument("count") # argument of out command
    def insert_test_data():
        User.query.delete()
        print("Creating test users")
        coordinates = [("Jane", 25.749809, -80.205849, "female"), 
        ( "Jim", 25.891762, -80.126991, "male"), 
        ("Jordan", 25.835552, -80.343100, "male"), 
        ("Laura", 25.87574236814734, -80.20135529044997, "female"), 
        ("Lisa", 25.900598439487815, -80.24567187168712, "female"), 
        ("Michael", 25.722401, -80.285079, "male")]
        for i in range(len(coordinates)):
            user = User()
            user.full_name = coordinates[i][0]
            user.gender = coordinates [i][3]
            user.latitude = coordinates[i][1]
            user.longitude = coordinates[i][2]
            user.email = coordinates[i][0].lower() + "@example.com"
            user.password = "134563d4e440f0e418b0f382f23a2cf301af6d7f648ccfae9895018345d779a3"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

        ### Insert the code to populate others tables if needed