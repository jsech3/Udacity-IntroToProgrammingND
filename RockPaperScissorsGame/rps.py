#!/usr/bin/env python3

import random

# Global moves list

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
        return 'rock'

    def learn(self, my_move, their_move):
        pass

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
        play_again = input(f"{Colors.BOLD}Do you want to play again? (Y/N): "
                           f"{Colors.ENDC}").lower()
        while play_again not in ['y', 'n']:
            play_again = input(f"{Colors.WARNING}{Colors.BOLD}Invalid input. "
                               f"Please enter 'Y' "
                               f" or 'N': {Colors.ENDC}").lower()
        if play_again == 'y':
            self.p1_score = 0
            self.p2_score = 0
            self.play_game()

# Function to determine if one move beats another


def beats(one, two):
    return ((one == 'rock' and two == 'scissors') or
            (one == 'scissors' and two == 'paper') or
            (one == 'paper' and two == 'rock'))


if __name__ == '__main__':
    # Choose your game settings here
    game = Game(HumanPlayer(), RandomPlayer(), rounds=5)
    game.play_game()
