# fabric-node-deploy
Fabric scripts to deploy a node server

## Use

Python Fabric required

    pip install fabric

Config files

    cp settings.py.sample settings.py


Deploy your app

    fab list
    fab prod deploy


Check logs

  fab prod error_log
  fab prod out_log
