import docker
import requests
from termcolor import colored

from phpmyadmin.support.config_reader import get_valid_config


def get_docker_client():
    return docker.from_env()


def check_docker():
    try:
        get_docker_client().info()

        return True
    except requests.exceptions.ConnectionError:
        print(colored('Docker is not running or may not be installed in your system.', 'red'))
        print(colored('To install docker visit \'http://www.docker.com\'', 'red'))

        return False
    except docker.errors.APIError as ex:
        print(colored(ex.message, 'red'))

        return False
    except:
        print(colored('Something went wrong.', 'red'))

        return False


def get_docker_version():
    return str(get_docker_client().version()['Version'])


def check_image(image_name, version='latest'):
    client = get_docker_client()
    try:
        client.images.get('%s:%s' % (image_name, version))
    except docker.errors.ImageNotFound:
        print(colored('%s:%s docker image does not exists in your system' % (image_name, version), 'red'))

        return False

    return True


def pull_image(image_name, version='latest'):
    client = get_docker_client()
    try:
        print(colored('Pulling image: \'%s:%s\' from docker repository' % (image_name, version), 'yellow'))
        client.images.pull('%s' % image_name, tag=version)
        print(colored('Pulled image: \'%s:%s\' from docker repository' % (image_name, version), 'blue'))

        return True
    except docker.errors.ImageNotFound:
        print(colored('Unable to pull image: \'%s:%s\' from docker repository.' % (image_name, version), 'red'))
        print(colored('Something went wrong.', 'red'))
        print
        print('##########################################################')
        print(colored('You can create an issue in the github repository at:', 'yellow'))
        print(colored('https://github.com/iBoneYard/phpmyadmin/issues', 'blue'))
        print
        print(colored('If you are a developer, please checkout the codebase at:', 'yellow'))
        print(colored('https://github.com/iBoneYard/phpmyadmin/', 'blue'))
        print
        print(colored('Pull requests are always welcomed :)', 'green'))
        print('##########################################################')
        print

        return False


def get_container(image_name, version='latest'):
    client = get_docker_client()
    for container in client.containers.list(all=True):
        if container.attrs['Config']['Image'] == '%s:%s' % (image_name, version):
            print(colored('  ==> Found <%s>[%s]' % (container.id, container.name), 'blue'))
            return container
    return False


def run_container(image_name, version='latest', detach=False):
    client = get_docker_client()
    for container in client.containers.list(all=True):
        if container.attrs['Config']['Image'] == '%s:%s' % (image_name, version):
            print(colored('  ==> Starting <%s>[%s]' % (container.id, container.name), 'blue'))
            container.start()
            return True

    print(colored('  ==> Creating phpmyadmin from [%s:%s]' % (image_name, version), 'blue'))
    client.containers.run(
        '%s:%s' % (image_name, version),
        detach=detach,
        ports={'80/tcp': get_valid_config().get('http_port')}
    )


def stop_container(image_name, version='latest'):
    client = get_docker_client()
    resp = False
    for container in client.containers.list():
        if container.attrs['Config']['Image'] == '%s:%s' % (image_name, version):
            print(colored('  ==> Stopping <%s>[%s]' % (container.id, container.name), 'blue'))
            container.stop()
            resp = True

    return resp


def stat_container(image_name, version='latest'):
    client = get_docker_client()
    resp = False
    for container in client.containers.list():
        if container.attrs['Config']['Image'] == '%s:%s' % (image_name, version):
            print(colored('  ==> Started <%s>[%s]' % (container.id, container.name), 'blue'))
            resp = True
    if not resp:
        print(colored('  ==> Not started', 'yellow'))
    return resp


def delete_container(image_name, version='latest'):
    client = get_docker_client()
    resp = False
    for container in client.containers.list(all=True):
        if container.attrs['Config']['Image'] == '%s:%s' % (image_name, version):
            print(colored('  ==> Deleting <%s>[%s]' % (container.id, container.name), 'blue'))
            container.kill()
            container.remove()
            resp = True

    return resp
