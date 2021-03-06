import { searchBuilds } from '../utils/files';
import { Artifact } from 'hardhat/types';
import * as path from 'path';
import { JsonFragment, JsonFragmentType } from '../types/artifacts/abi';

const ARTIFACTS_FOLDER = 'artifacts';

export class SystemCrawlingService {
  private readonly currentPath: string;

  constructor(currentPath: string) {
    this.currentPath = path.resolve(currentPath, ARTIFACTS_FOLDER);
  }

  crawlSolidityContractsNames(): string[] {
    const contracts: string[] = [];

    const artifacts = searchBuilds(this.currentPath, []) as Artifact[];
    const contractArtifacts = SystemCrawlingService.filterArtifacts(artifacts);

    for (const artifacts of contractArtifacts) {
      contracts.push(artifacts.contractName);
    }

    return contracts;
  }

  crawlSolidityFunctionsOfContract(contractName: string): {
    name: string,
    inputs?: Array<JsonFragmentType>,
  }[] {
    const functionNames: {
      name: string,
      inputs?: Array<JsonFragmentType>,
    }[] = [];

    const artifacts = searchBuilds(this.currentPath, []) as Artifact[];
    const contractBuilds = SystemCrawlingService.filterArtifactsByName(artifacts, contractName);

    for (let singleAbiElement of contractBuilds.abi) {
      singleAbiElement = singleAbiElement as JsonFragment;

      if (singleAbiElement?.name) {
        functionNames.push({
          name: singleAbiElement.name,
          inputs: singleAbiElement.inputs,
        });
      }
    }

    return functionNames;
  }

  private static filterArtifactsByName(artifacts: Artifact[], contractName: string): Artifact {
    for (const artifact of artifacts) {
      if (artifact.contractName == contractName) {
        return artifact;
      }
    }
  }

  private static filterArtifacts(artifacts: Artifact[]): Artifact[] {
    const filteredArtifacts: Artifact[] = [];

    for (const artifact of artifacts) {
      if (artifact.bytecode && artifact.contractName) {
        filteredArtifacts.push(artifact);
      }
    }

    return filteredArtifacts;
  }
}
