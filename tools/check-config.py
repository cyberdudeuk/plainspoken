"""C27: every YAML file in repo-config/github parses, each workflow has jobs with steps that
use or run something, and issue forms have a name, description and body. (Defect D12.)"""
import glob, sys, yaml
fail = 0
for f in sorted(glob.glob("repo-config/github/**/*.yml", recursive=True)):
    try:
        d = yaml.safe_load(open(f))
        assert isinstance(d, dict), "not a mapping"
        if "/workflows/" in f:
            assert d.get("jobs"), "no jobs"
            for j in d["jobs"].values():
                assert j.get("steps"), "job without steps"
                for st in j["steps"]:
                    assert "uses" in st or "run" in st, "step without uses/run"
        if "/ISSUE_TEMPLATE/" in f and not f.endswith("config.yml"):
            assert d.get("name") and d.get("description") and d.get("body"), "issue form missing name/description/body"
        print("PASS", f)
    except Exception as e:
        fail += 1; print("FAIL", f, "-", e)
print("C27", "passed" if not fail else f"{fail} file(s) failed"); sys.exit(1 if fail else 0)
