override DOCKER        = $(shell which docker)
override MAIN_MODULE   = ${shell pwd}
override UID           = ${shell id -u}
override GID           = ${shell id -g}

DOCKER_IMAGE  ?= reg.actiontech.com/actiontech-dev/pnpm:10.10.0-node20
COMMAND       ?=
EDITION       ?=ce

RELEASE_FTP_HOST ?=
ICONS_DOCS_OUTER_BUILD_NAME ?= docs-dist.tar.gz
SYNC_ICONS_DOCS_STATIC_HOST ?=

ifeq ($(EDITION),ce)
    COMMAND :=pnpm start
else ifeq ($(EDITION),ee)
    COMMAND :=pnpm start:ee
else ifeq ($(EDITION),demo)
    COMMAND :=pnpm start:demo
endif

docker_start_dev:
	$(DOCKER) run -v $(MAIN_MODULE):/app -w /app -p 30201:3020 --name=dms_ui_dev_${EDITION} $(DOCKER_IMAGE) sh -c "${COMMAND} --no-open"	

pull_image:
	$(DOCKER) pull ${DOCKER_IMAGE}

docker_install_node_modules:
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app --user $(UID):$(GID) -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm install --frozen-lockfile"

docker_check: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) pnpm checker

docker_test: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) pnpm test:ci

docker_clean:
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "git config --global --add safe.directory /usr/src/app && git clean -dfx"

docker_build_ce: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app --user $(UID):$(GID) -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm build"

docker_build_ee: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app --user $(UID):$(GID) -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm build:ee"

docker_build_demo: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app --user $(UID):$(GID) -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm build:demo"

docker_publish_and_docs_deploy: docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app --user $(UID):$(GID) -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "git config --global --add safe.directory /usr/src/app && pnpm publishAndDocsDeploy"
