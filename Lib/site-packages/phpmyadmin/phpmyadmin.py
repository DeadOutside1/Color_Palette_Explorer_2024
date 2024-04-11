import getopt
import sys

from support.config_reader import get_valid_config
from support.docker_functions import check_docker, check_image, pull_image
from support.docker_functions import run_container, stop_container, delete_container, stat_container
from termcolor import colored

IMAGE_NAME = 'phpmyadmin/phpmyadmin'
ARGS = ['start', 'stop', 'restart', 'status', 'delete']


def start():
    config = get_valid_config()
    check_docker()
    if not check_image(IMAGE_NAME, config.get('image_version')):
        print(pull_image(IMAGE_NAME, config.get('image_version')))

    run_container(IMAGE_NAME, config.get('image_version'), detach=True)


def restart():
    config = get_valid_config()
    check_docker()
    if not check_image(IMAGE_NAME, config.get('image_version')):
        print(pull_image(IMAGE_NAME, config.get('image_version')))

    stop_container(IMAGE_NAME, config.get('image_version'))
    run_container(IMAGE_NAME, config.get('image_version'), detach=True)


def stop():
    config = get_valid_config()
    stop_container(IMAGE_NAME, config.get('image_version'))


def delete():
    config = get_valid_config()
    delete_container(IMAGE_NAME, config.get('image_version'))


def status():
    config = get_valid_config()
    stat_container(IMAGE_NAME, config.get('image_version'))


def phpmyadmin_main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], '', ARGS)
        if len(opts) > 0:
            for arg in ARGS:
                if arg in opts:
                    opts.remove(arg)
            print(colored('unknown options: %s' % str(opts), 'red'))
            print(colored('Usage:\n\tpma <%s>' % '|'.join(ARGS), 'red'))
            sys.exit(2)
        elif len(args) != 1:
            print(colored('Usage:\n\tpma <%s>' % '|'.join(ARGS), 'red'))
            sys.exit(2)
        elif args[0] not in ARGS:
            print(colored('unknown options: %s' % str(opts), 'red'))
            print(colored('Usage:\n\tpma <%s>' % '|'.join(ARGS), 'red'))
            sys.exit(2)

        globals()[args[0]]()
    except getopt.GetoptError:
        opts = sys.argv[1:]
        for arg in ARGS:
            if arg in opts:
                opts.remove(arg)

        print(colored('unknown options: %s' % str(opts), 'red'))
        print(colored('Usage:\n\tpma <%s>' % '|'.join(ARGS), 'red'))
