import { Option } from "../../utils"

@nearBindgen
export class Cluster {
    constructor(
        public max_lvl: u8,
        /// Last dragon that is waiting for battle in this cluster.
        public waiting_for_battle: Option<u64>
    ) { }
}


/**
 * VERSIONED MODEL

pub enum VCluster {
    V1(Cluster)
}

impl From<VCluster> for Cluster {
    fn from(c: VCluster) -> Self {
        match c {
            VCluster::V1(c) => c
        }
    }
}
*/
