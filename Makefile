clean:
	find . \( -name "node_modules" -o -name "build" -o -name "dist" -o -name ".next" \) -type d -exec rm -rf {} +

docker:
	@cd item_warehouse_website && \
	docker-compose --verbose up --build

install:
	npm install

website-local:
	npm run dev

# VSCode Shortcuts #

vscode-shortcut-1:
	make website-local

vscode-shortcut-2:
	make docker

vscode-shortcut-3:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-4:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-5:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-6:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-7:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-8:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-9:
	@echo "Shortcut not defined"
	@exit 1

%:
	@:
