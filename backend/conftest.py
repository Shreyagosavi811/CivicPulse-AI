import os
import sys

# Ensure the backend directory is in sys.path so tests can import main.py
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
