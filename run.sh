touch .env
for INPUT in $(echo $INPUTS | jq -r 'to_entries|map("INPUT_\(.key|ascii_upcase)=\(.value|@uri)")|.[]'); do
    echo $INPUT >> .env
done
env | grep -E '^(GITHUB|ACTIONS|CI|TZ)' >> .env

docker pull ppodds/mc-status-card:latest
docker run --env-file .env ppodds/mc-status-card