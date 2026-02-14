import json
# run in json folder

for i in range(1, 101):
    filepath = "%d.json" % i
    file = open(filepath, "w")
    metadata = {
        "name": "Example NFT #%d" % i,
        "description": "Basic NFT minting metadata example.",
        "image": "https://example.com/nft/%d.png" % i,
        "attributes": [],
    }
    with file as outfile:
        json.dump(metadata, outfile)
    file.close()