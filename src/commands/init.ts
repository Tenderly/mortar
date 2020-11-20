import {Command, flags} from '@oclif/command'
import ConfigService from "../packages/config/service";

export default class Init extends Command {
  static description = 'Initialize mortar configuration file'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    networkId: flags.string(
      {
        name: 'network_id',
        description: 'Network ID of the network you are willing to deploy your contracts',
        required: true
      }
    ),
    privateKey: flags.string(
      {
        name: 'private_key',
        description: 'Private Key of the deployer account',
        required: true
      }
    ),
  }


  async run() {
    const {flags} = this.parse(Init)

    //@TODO(filip): add support for other signing ways (e.g. memonic, seed phrase, hd wallet, etc)
    const configService = new ConfigService(process.cwd())
    configService.generateAndSaveConfig(flags.privateKey as string)

    // @TODO: iterate over all sol files and generate TS interface
  }
}
