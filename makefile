IMAGE_NAME=ded/adoorman
BUILD_NUMBER=n/a
REGISTRY_URL=579478677147.dkr.ecr.eu-central-1.amazonaws.com
REGISTRY_IMAGE_NAME=$(REGISTRY_URL)/$(IMAGE_NAME):$(BUILD_NUMBER)

init: restore

restore:
	cd src; npm install

container:
	docker build -t $(IMAGE_NAME) .

release: container
	$(eval dockerlogin=$(shell sh -c "aws ecr get-login --no-include-email"))
	eval $(dockerlogin)
	docker tag $(IMAGE_NAME):latest $(REGISTRY_IMAGE_NAME)
	docker push $(REGISTRY_IMAGE_NAME)

run:
	cd src; npm start