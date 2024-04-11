import os
from ConfigParser import ConfigParser, NoOptionError

import sys
from termcolor import colored


def get_valid_config():
    config = get_config()
    if config is None:
        sys.exit(1)

    return config


def get_config():
    return __read_config()


def __get_attr(parser, section, name, default=''):
    try:
        return parser.get(section, name)
    except NoOptionError:
        return default


def __read_config():
    config_file = '%s/.pma' % os.path.expanduser('~')
    if os.path.isfile(config_file):
        config = dict()
        c_parser = ConfigParser()
        c_parser.read(config_file)

        config['host'] = __get_attr(c_parser, 'phpmyadmin', 'host', 'localhost')
        config['port'] = __get_attr(c_parser, 'phpmyadmin', 'port', '3306')
        config['user'] = __get_attr(c_parser, 'phpmyadmin', 'user', 'root')
        config['pass'] = __get_attr(c_parser, 'phpmyadmin', 'pass', '')
        config['http_port'] = __get_attr(c_parser, 'pma', 'http_port', '8080')
        config['image_version'] = __get_attr(c_parser, 'pma', 'image_version', 'latest')

        return config
    else:
        print(colored('Config file not found.', 'red'))
        print(colored('Please create the file \'~/.pma\' in your home directory', 'red'))
        return None
