$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$dataRoot = Join-Path $root "project/assets/resources/data"

$script = @'
import json
import sys
from pathlib import Path

root = Path(sys.argv[1])

def load(name):
    with (root / f"{name}.json").open(encoding="utf-8") as handle:
        return json.load(handle)["_root"][0]

activities = load("Activities")["_activity"]
tower = next(item for item in activities if str(item["id"]) == "109")
stages = tower["_tier"][0]["_item"]
assert len(stages) == 8000
assert {int(item["id"]) for item in stages} == set(range(1, 8001))
last = next(item for item in stages if str(item["id"]) == "8000")
assert (str(last["tierID"]), str(last["stageID"])) == ("800", "10")

monsters = {str(item["monster_id"]): item for item in load("Monster")["_items"][0]["_item"]}
last_monster = monsters[str(last["monsterID"])]
assert last_monster["monster_name"].endswith("（加强版·19）")

bonuses = load("Bonuses")["_bonuses"][0]["_item"]
groups = {}
for item in bonuses:
    groups.setdefault(str(item["bonusesId"]), []).append(item)

floor_101 = next(item for item in stages if str(item["tierID"]) == "101" and str(item["stageID"]) == "10")
floor_800 = last
assert any(str(item["type"]) == "6" and str(item["point"]) == "50" for item in groups[str(floor_101["farstBonuseID"])])
assert any(str(item["type"]) == "6" and str(item["point"]) == "1000" for item in groups[str(floor_800["farstBonuseID"])])
assert all(str(item["type"]) != "6" for item in groups[str(floor_101["bonuseID"])])

print("TOWER_CLIENT_CONTRACT_OK stages=8000 last=800/10 vouchers=50..1000")
'@

$script | python - $dataRoot
if ($LASTEXITCODE -ne 0) { throw "tower client JSON contract failed" }
