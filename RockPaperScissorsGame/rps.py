import random

# moves list

moves = ['rock', 'paper', 'scissors']

# ANSI color codes for terminal output


class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[34m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[32m'
    WARNING = '\033[93m'
    FAIL = '\033[31m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    BLINK = '\033[5m'

# Player base class


class Player:
    def move(self):
        raise NotImplementedError("This "
                                  f"method should be defined in subclasses.")

    def learn(self, my_move, their_move):
        pass

# RockPlayer that always plays 'rock'


class RockPlayer(Player):
    def move(self):
        return 'rock'

# Random player


class RandomPlayer(Player):
    def move(self):
        return random.choice(moves)

# Human player with input validation


class HumanPlayer(Player):
    def move(self):
        move = input(f"{Colors.BOLD}{Colors.OKBLUE}Rock, paper, or scissors? "
                     f"(or type 'quit' to end) > {Colors.ENDC}").lower()
        while move not in moves and move != 'quit':
            move = input(f"{Colors.WARNING}Invalid move. Please enter 'rock', "
                         f"'paper', or 'scissors' > {Colors.ENDC}").lower()
        if move == 'quit':
            raise KeyboardInterrupt
        return move

# Reflect player that imitates the opponent's last move


class ReflectPlayer(Player):
    def __init__(self):
        self.their_last_move = 'rock'

    def move(self):
        return self.their_last_move

    def learn(self, my_move, their_move):
        self.their_last_move = their_move

# Cycle player that cycles through the moves


class CyclePlayer(Player):
    def __init__(self):
        self.my_last_move = 'rock'

    def move(self):
        index = (moves.index(self.my_last_move) + 1) % len(moves)
        self.my_last_move = moves[index]
        return self.my_last_move

    def learn(self, my_move, their_move):
        pass

# Game class to handle rounds and score


class Game:
    def __init__(self, p1, p2, rounds=5):
        self.p1 = p1
        self.p2 = p2
        self.p1_score = 0
        self.p2_score = 0
        self.rounds = rounds

    def play_round(self):
        move1 = self.p1.move()
        move2 = self.p2.move()
        print(f"{Colors.BOLD}Player 1: {Colors.OKGREEN}{move1}{Colors.ENDC}  "
              f"{Colors.BOLD}Player 2: {Colors.FAIL}{move2}{Colors.ENDC}")

        if beats(move1, move2):
            print(f"{Colors.BOLD}{Colors.OKGREEN}"
                  f"** Player 1 wins this round **{Colors.ENDC}")
            self.p1_score += 1
        elif beats(move2, move1):
            print(f"{Colors.BOLD}{Colors.FAIL}** Player 2 wins this round **"
                  f"{Colors.ENDC}")
            self.p2_score += 1
        else:
            print(f"{Colors.BOLD}{Colors.WARNING}** It's a tie **"
                  f"{Colors.ENDC}")

        print(f"{Colors.BOLD}{Colors.HEADER}Score: Player 1: {self.p1_score}, "
              f"Player 2: {self.p2_score}{Colors.ENDC}")

        self.p1.learn(move1, move2)
        self.p2.learn(move2, move1)

    def play_game(self):
        print(f"{Colors.BOLD}{Colors.HEADER}Game start! Type 'quit' at any "
              f"time to stop playing.{Colors.ENDC}")
        try:
            for round_number in range(1, self.rounds + 1):
                print(f"{Colors.UNDERLINE}Round {round_number}:{Colors.ENDC}")
                self.play_round()
                # Check if either player has reached 3 points
                if self.p1_score == 3 or self.p2_score == 3:
                    break
        except KeyboardInterrupt:
            print(f"{Colors.WARNING}"
                  f"Game interrupted by the user.{Colors.ENDC}")
        finally:
            print(f"{Colors.BOLD}{Colors.HEADER}Game over!{Colors.ENDC}")
            if self.p1_score > self.p2_score:
                print(f"{Colors.BOLD}{Colors.OKGREEN}"
                      f"** Player 1 wins the game! **{Colors.ENDC}")
            elif self.p2_score > self.p1_score:
                print(f"{Colors.BOLD}{Colors.FAIL}"
                      f"** Player 2 wins the game! **{Colors.ENDC}")
            else:
                print(f"{Colors.BOLD}{Colors.WARNING}** The game is a tie! **"
                      f"{Colors.ENDC}")
            print(f"{Colors.BOLD}{Colors.HEADER}Final Score: Player 1: "
                  f"{self.p1_score}, Player 2: {self.p2_score}{Colors.ENDC}")

            self.play_again()

    def play_again(self):
        # Ask if the user wants to play again with proper input validation
        while True:
            play_again = input(f"{Colors.BOLD}Want "
                               f"to play again? (Y/N): {Colors.ENDC}").lower()
            if play_again in ['y', 'n']:
                break
            print(f"{Colors.WARNING}Invalid "
                  f"input. Please enter 'Y' or 'N'.{Colors.ENDC}")

        if play_again == 'y':
            # Ask if the user wants to use the same players with validation
            while True:
                same_players = input(f"{Colors.BOLD}With the "
                                     f"same players? "
                                     f"(Y/N): {Colors.ENDC}").lower()
                if same_players in ['y', 'n']:
                    break
                print(f"{Colors.WARNING}Invalid input. Please "
                      f"enter 'Y' or 'N'.{Colors.ENDC}")

            if same_players == 'y':
                # Reset the scores for both players before playing again
                self.p1_score = 0
                self.p2_score = 0
                self.play_game()
            else:
                # Let the user choose new players, and reset the scores
                player1 = choose_player(1)
                player2 = choose_player(2)
                self.__init__(player1, player2, rounds=5)
                self.play_game()
        else:
            # End the game with a message
            print(f"{Colors.BOLD}{Colors.OKGREEN}See ya "
                  f"next time!{Colors.ENDC}")

# Function to determine if one move beats another


def beats(one, two):
    return ((one == 'rock' and two == 'scissors') or
            (one == 'scissors' and two == 'paper') or
            (one == 'paper' and two == 'rock'))


# Map player types to their corresponding classes
player_types = {
    '1': HumanPlayer,
    '2': RockPlayer,
    '3': RandomPlayer,
    '4': ReflectPlayer,
    '5': CyclePlayer
}

# Function to prompt user for player selection


def choose_player(player_number):
    print(f"\nChoose Player {player_number}:")
    print("1. Human Player")
    print("2. Rock Player (Always plays rock)")
    print("3. Random Player (Chooses randomly)")
    print("4. Reflect Player (Copies opponent's last move)")
    print("5. Cycle Player (Cycles through moves)")

    choice = input("Enter the number of the player you want: ")

    while choice not in player_types:
        print("Invalid choice. Please try again.")
        choice = input("Enter the number of the player you want: ")

    return player_types[choice]()


if __name__ == '__main__':
    # Prompt user to choose player types
    player1 = choose_player(1)
    player2 = choose_player(2)

    # Start the game with the chosen players
    game = Game(player1, player2, rounds=5)
    game.play_game()
