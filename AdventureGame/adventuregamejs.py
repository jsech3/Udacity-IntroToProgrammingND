import time
import random


# Helper function to print messages with a delay
def print_pause(message, delay=2):
    print(message)
    time.sleep(delay)


# Function for the intro
def intro():
    print_pause("You are an agent of S.H.I.E.L.D. stationed at a secure "
                "facility.")
    print_pause("A villainous threat is looming, and the Avengers are nowhere "
                "in sight!")
    print_pause("In front of you is Avengers Tower.")
    print_pause("To your left, there's a Quinjet that looks like it might "
                "have some valuable loot inside.")
    print_pause("You have a basic blaster in your hand, but you sense "
                "more powerful weapons might be nearby.")


# Function to validate user input
def valid_input(prompt, options):
    while True:
        choice = input(prompt).lower()
        if choice in options:
            return choice
        else:
            print_pause("Sorry, that's not an option.")


# Function for when the player fights the villain
def fight(villain, weapon):
    weapon_win_chances = {
        'blaster': 0.4,  # 40% chance to win
        'Thor\'s Hammer': 0.9  # 90% chance to win
    }

    random_chances = {
        'Captain America\'s Shield': random.uniform(0.4, 0.80),
        'Iron Man\'s Repulsors': random.uniform(0.4, 0.80),
        'Hawkeye\'s Bow': random.uniform(0.4, 0.8),
        'Ant-Man\'s Suit': random.uniform(0.4, 0.8),
        'Black Widow\'s Batons': random.uniform(0.4, 0.8)
    }

    weapon_win_chances.update(random_chances)
    win_probability = weapon_win_chances.get(weapon, 0.4)
    # Default to blaster's win rate if not found

    print_pause(f"As {villain} prepares to attack, you ready your {weapon}.")

    if random.random() < win_probability:
        print_pause(f"The {weapon} crackles with energy as you charge at "
                    f"{villain}.")
        print_pause(f"{villain} can't withstand the might of {weapon}!")
        print_pause("You've defeated the villain and saved the city!")
        return True  # Player won
    else:
        print_pause(f"Your {weapon} is no match for {villain}'s powers.")
        print_pause("You've been overpowered!")
        return False  # Player lost


# Function to randomly find a weapon (excluding the current weapon)
def find_new_weapon(current_weapon, location):
    if location == 'tower':
        all_weapons = ['Captain America\'s Shield', 'Black Widow\'s Batons',
                       'Iron Man\'s Repulsors']
    else:
        all_weapons = ['Thor\'s Hammer', 'Hawkeye\'s Bow', 'Ant-Man\'s Suit']

    available_weapons = [weapon for weapon in all_weapons
                         if weapon != current_weapon]
    return random.choice(available_weapons)


# Function for Avengers Tower
def avengers_tower(villain, weapon, tower_visits):
    print_pause("You enter Avengers Tower, hoping to find help.")

    if tower_visits == 0:
        tower_event = random.choice(['weapon', 'villain'])
    else:
        villain_probability = min(0.3 + (0.2 * tower_visits), 1.0)
        if random.random() > villain_probability:
            print_pause("Nothing has changed, but you hear noise "
                        "near the Quinjet.")
            return weapon  # Return current weapon unchanged
        else:
            tower_event = random.choice(['weapon', 'villain'])

    if tower_event == 'villain':
        print_pause(f"But instead, {villain} is waiting for you inside!")
        print_pause(f"{villain} launches an attack!")
        choice = valid_input("Would you like to (1) fight or (2) retreat to "
                             "the courtyard? ", ['1', '2'])
        if choice == '1':
            result = fight(villain, weapon)
            if result:
                return True  # Player won
            else:
                return False  # Player lost
        else:
            print_pause("You retreat -- shaken but determined.")
            return weapon  # Return current weapon
    else:
        new_weapon = find_new_weapon(weapon, 'tower')
        print_pause(f"You find {new_weapon} inside the tower!")
        choice = valid_input(f"Would you like to swap your {weapon} for "
                             f"{new_weapon}? (y/n)\n", ['y', 'n'])
        if choice == 'y':
            print_pause(f"You discard your {weapon} and take {new_weapon} "
                        "with you.")
            return new_weapon  # Return the new weapon
        else:
            print_pause(f"You decide to keep your {weapon}.")
            return weapon  # Return the current weapon


# Function for the Quinjet
def quinjet(villain, weapon, quinjet_visits):
    print_pause("You cautiously enter the Quinjet, searching for something "
                "useful.")

    if quinjet_visits == 0:
        quinjet_event = random.choice(['weapon', 'villain'])
    else:
        villain_probability = min(0.3 + (0.2 * quinjet_visits), 1.0)
        if random.random() > villain_probability:
            print_pause("Nothing has changed, but you hear noise near "
                        "Avengers Tower.")
            return weapon  # Return current weapon unchanged
        else:
            quinjet_event = random.choice(['weapon', 'villain'])

    if quinjet_event == 'villain':
        print_pause(f"But instead, {villain} is waiting for you inside the "
                    "Quinjet!")
        print_pause(f"{villain} launches an attack!")

        choice = valid_input("Would you like to (1) fight or (2) retreat to "
                             "the courtyard? ", ['1', '2'])
        if choice == '1':
            result = fight(villain, weapon)  # Proceed to fight
            if result:
                return True  # Player won
            else:
                return False  # Player lost
        else:
            print_pause("You retreat -- shaken but determined.")
            return weapon  # Return current weapon
    else:
        new_weapon = find_new_weapon(weapon, 'quinjet')
        print_pause(f"You find {new_weapon} inside the Quinjet!")
        choice = valid_input(f"Would you like to swap your {weapon} for "
                             f"{new_weapon}? (y/n)\n", ['y', 'n'])
        if choice == 'y':
            print_pause(f"You discard your {weapon} and take {new_weapon} "
                        "with you.")
            return new_weapon  # Return the new weapon
        else:
            print_pause(f"You decide to keep your {weapon}.")
            return weapon  # Return the current weapon


# Function for the main gameplay
def shield_facility():
    villain = random.choice(['Loki', 'Ultron', 'Thanos', 'Hela'])
    weapon = "blaster"

    tower_visits = 0
    quinjet_visits = 0

    intro()

    while True:
        choice = valid_input("Enter 1 to head into Avengers Tower.\n"
                             "Enter 2 to explore the Quinjet.\n"
                             "Which do you choose? (1 or 2)\n", ['1', '2'])
        if choice == '1':
            result = avengers_tower(villain, weapon, tower_visits)
            tower_visits += 1
            if result is False:
                return False  # Player was defeated
            elif result is True:
                return True  # Player won the game
            else:
                weapon = result
        else:
            result = quinjet(villain, weapon, quinjet_visits)
            quinjet_visits += 1
            if result is False:
                return False  # Player was defeated
            elif result is True:
                return True  # Player won the game
            else:
                weapon = result

        print_pause("You return to the facility courtyard, preparing for your "
                    "next move.")


# Function to play the game again
def play_again():
    choice = valid_input("Would you like to play again? (y/n)\n", ['y', 'n'])
    return choice == 'y'


# Main function to run the game
def play_game():
    while True:
        result = shield_facility()
        if result is False:
            print_pause("You were defeated... the world is in peril.")
        elif result is True:
            print_pause("Congratulations, you've saved the Avengers!!")
        if not play_again():
            print_pause("Thanks for playing! Stay vigilant, agent.")
            break


if __name__ == '__main__':
    play_game()
