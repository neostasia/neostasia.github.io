import html
import time 

def unix_ts():
    return int(time.time())

def sanitize_inputs(dict):
    return {k: html.escape(v.strip()) for k, v in dict.items()}

# ...