#!/bin/bash

#=================================================================
# CONSTANTS
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
USER_FILE="../../../node-sample/users.json"
VTN_FILE="../../../node-sample/virtual_numbers.json"
DHS_DIR="../../../node-dhs/"
SAMPLE_DIR="../../../node-sample/"
#=================================================================

#Variables for holding process IDs
SAMPLE_PID=""
DHS_PID=""

setup ()
{
  installTest
  installDhs
  installSample
  findNpmRemnants
  findNodeRemnants
  clearUserFile
  clearVtnFile
}

cleanup ()
{
  findNpmRemnants
  findNodeRemnants
  clearUserFile
  clearVtnFile
}

clearUserFile ()
{
  cd ${SCRIPT_DIR}
  if [ -f ${USER_FILE} ];
  then
    rm ${USER_FILE}
  else
    echo "users.json file does not exist."
  fi
}

clearVtnFile ()
{
  cd ${SCRIPT_DIR}
  if [ -f ${VTN_FILE} ];
  then
    rm ${VTN_FILE}
  else
    echo "virtual_numbers.json file does not exist."
  fi
}

installTest ()
{
  cd ${SCRIPT_DIR}
  npm install
}&> /dev/null

installDhs ()
{
  cd ${SCRIPT_DIR}
  cd ${DHS_DIR}
  npm install
}&> /dev/null

startDhs ()
{
  cd ${SCRIPT_DIR}
  cd ${DHS_DIR}
  npm-start &
  DHS_PID=$!
}&> /dev/null

stopDhs ()
{
  kill ${DHS_PID}
  echo "DHS stopping..."
  sleep 1
}

installSample ()
{
  cd ${SCRIPT_DIR}
  cd ${SAMPLE_DIR}
  npm install
}&> /dev/null

startSample ()
{
  cd ${SCRIPT_DIR}
  cd ${SAMPLE_DIR}
  npm start &
  SAMPLE_PID=$!
}&> /dev/null

stopSample ()
{
  kill ${SAMPLE_PID}
  echo "Sample App stopping..."
  sleep 1
}

findNodeRemnants ()
{
  NODE_PID=$(ps aux | grep node | grep -v grep | awk '{print $2}')
  if [[ -z "$NODE_PID" ]];
    then
    echo "Clean"
    sleep 2
  else
    for pid in "${NODE_PID[@]}"; do
      kill ${pid}
      echo "Stopping node instance..."
      sleep 2
    done
  fi
}

findNpmRemnants ()
{
  NPM_PID=$(ps aux | grep npm | grep -v grep | awk '{print $2}')
  if [[ -z "$NPM_PID" ]];
    then
    echo "Clean"
    sleep 2
  else
    for pid in "${NPM_PID[@]}"; do
    kill ${pid}
    echo "Stopping npm instance..."
    sleep 2
    done
  fi
}

main ()
{
  setup

  startDhs
  echo "DHS starting.."
  sleep 5
  startSample
  echo "Sample App starting.."
  sleep 5
  echo ""
  echo "Starting tests"

  cd ${SCRIPT_DIR}
  ./run_test.sh

  echo "finished"

  sleep 5

  stopDhs
  stopSample

  cleanup
  echo "complete"
  exit $?
}

#=================================================================
#==========================    MAIN    ===========================
#=================================================================

main