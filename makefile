.PHONY: create-env

create-env:
	@if ! grep -q 'DATABASE_URL="mysql://root:@localhost:3306/masaf"' .env 2>/dev/null; then \
		echo 'DATABASE_URL="mysql://root:@localhost:3306/masaf"' >> .env; \
	fi