override DOCKER        = $(shell which docker)
override MAIN_MODULE   = ${shell pwd}
override PROJECT_NAME  = dms-ui
override VERSION = 99.99.99

DOCKER_IMAGE  ?= reg.actiontech.com/actiontech-dev/pnpm:8.3.1-node16
RELEASE_FTPD_HOST ?= ftpadmin:KFQsB9g0aut7@10.186.18.90
OUTER_BUILD_NAME = $(PROJECT_NAME).tar.gz
FTP_BUILD_NAME = $(PROJECT_NAME)-$(VERSION).tar.gz


pull_image:
	$(DOCKER) pull ${DOCKER_IMAGE}

docker_install_node_modules:
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "pnpm config set registry https://registry.npm.taobao.org && pnpm install --no-frozen-lockfile"

docker_check: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) pnpm checker


docker_test: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) pnpm test:ci

docker_clean:
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) sh -c "git config --global --add safe.directory /usr/src/app && git clean -dfx"

docker_build: pull_image docker_install_node_modules
	$(DOCKER) run -v $(MAIN_MODULE):/usr/src/app -w /usr/src/app --rm $(DOCKER_IMAGE) pnpm build && tar zcf ${OUTER_BUILD_NAME} ./packages/base/dist


upload:
	curl -T $(OUTER_BUILD_NAME)  \
	ftp://$(RELEASE_FTPD_HOST)/actiontech-$(PROJECT_NAME)/$(VERSION)/$(FTP_BUILD_NAME) --ftp-create-dirs